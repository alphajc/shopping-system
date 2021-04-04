import Redis from '@ioc:Adonis/Addons/Redis'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import OrderForm from 'App/Models/OrderForm'
import OrderDetail from 'App/Models/OrderDetail'
import axios from 'axios'
import { warehouse_addr } from 'Config/service'
import AlreadyPaidException from 'App/Exceptions/AlreadyPaidException'

interface Shipment {
  product: number
  count: number
}

interface Invoice {
  orderFormId: number
  username: string
  address: string
  mobile: string
}

interface Product {
  name: string
  price: number
  description: string
  count: number
  lock_cnt: number
}

export default class OrdersController {
  public async order({ logger, request, auth }: HttpContextContract) {
    /**
     * 检查参数有效性
     */
    const orderRequest = await request.validate({
      schema: schema.create({
        product: schema.array.optional().members(
          schema.object().members({
            id: schema.number(),
            count: schema.number([rules.range(0, 99999)]),
          })
        ),
        carts: schema.array.optional().members(schema.number()),
        recipient: schema.string({ trim: true }),
        address: schema.string({ trim: true }),
        mobile: schema.string({ trim: true }, [rules.mobile()]),
      }),
    })

    logger.info(JSON.stringify(orderRequest))
    /**
     * 确认订单
     */
    const orderForm = new OrderForm()
    if (auth.user) {
      orderForm.userId = auth.user.id
    }
    orderForm.address = orderRequest.address
    orderForm.mobile = orderRequest.mobile
    orderForm.recipient = orderRequest.recipient
    orderForm.price = 0
    const orderFormRes = await orderForm.save()

    if (orderRequest.product) {
      await Promise.all(
        orderRequest.product.map(async (p) => {
          const orderDetail = new OrderDetail()
          orderDetail.orderFormId = orderFormRes.id
          orderDetail.productId = p.id
          orderDetail.count = p.count
          await orderDetail.save()
          const res = await axios.get(`${warehouse_addr}/product/${p.id}`)
          const product: Product = res.data
          logger.debug(`warehouse response: ${JSON.stringify(product)}`)
          orderFormRes.price += product.price * p.count
          logger.info(`product:${product.name} count:${p.count}`)
        })
      )
    }

    return await orderFormRes.save()
  }

  public async confirmPaid({params}: HttpContextContract) {

    // Todo: 检查是否支付成功
    // 更改支付状态
    const orderForm = await OrderForm.findOrFail(params.id)
    if(orderForm.pay_stat) {
      throw new AlreadyPaidException(`订单 ${params.id} 已支付！`)
    }
    orderForm.pay_stat = true
    orderForm.save()

    /**
     * 异步推送给仓库系统
     */
    const orderDetails = await OrderDetail.query().where('order_form_id', params.id)
    const shipments: [Shipment?] = []
    await Promise.all(
      orderDetails.map(async (orderDetail) => {
        shipments.push({ product: orderDetail.productId, count: orderDetail.count })
      })
    )
    Redis.publish('order:warehouse', JSON.stringify(shipments))

    /**
     * 异步推送给物流系统
     */
    const invoice: Invoice = {
      orderFormId: orderForm.id,
      username: orderForm.recipient,
      address: orderForm.address,
      mobile: orderForm.mobile,
    }
    Redis.publish('order:delivery', JSON.stringify(invoice))

    return orderForm
  }

  public async index({ params, auth }: HttpContextContract) {
    if (auth.user) {
      if (params.id) {
        return await OrderForm.findOrFail(params.id)
      } else {
        return await OrderForm.query().where('user_id', auth.user?.id)
      }
    }
  }
}
