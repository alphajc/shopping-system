import Redis from '@ioc:Adonis/Addons/Redis'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import OrderForm from 'App/Models/OrderForm'
import OrderDetail from 'App/Models/OrderDetail'
import axios from 'axios'
import { warehouse_addr } from 'Config/service'

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
  public async order({ logger, request, auth, response }: HttpContextContract) {
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
      // orderForm.related('user').associate(auth.user)
      orderForm.userId = auth.user.id
    }
    orderForm.address = orderRequest.address
    orderForm.mobile = orderRequest.mobile
    orderForm.recipient = orderRequest.recipient
    orderForm.price = 0
    const orderFormRes = await orderForm.save()

    const shipments: [Shipment?] = []
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
          shipments.push({ product: p.id, count: p.count })
        })
      )
    }

    /**
     * 推送给仓库系统
     */
    Redis.publish('order:warehouse', JSON.stringify(shipments))

    /**
     * 推送给物流系统
     */
    const invoice: Invoice = {
      orderFormId: orderFormRes.id,
      username: orderFormRes.recipient,
      address: orderFormRes.address,
      mobile: orderFormRes.mobile,
    }
    Redis.publish('order:delivery', JSON.stringify(invoice))

    response.json(await orderFormRes.save())
  }
  public async index({ params, auth, response }: HttpContextContract) {
    if (auth.user) {
      if (params.id) {
        response.json(await OrderForm.findOrFail(params.id))
      } else {
        const orderForms = await OrderForm.query().where('user_id', auth.user?.id)
        response.json(orderForms)
      }

    }
  }
}
