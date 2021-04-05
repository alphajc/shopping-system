import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Cart from 'App/Models/Cart';

export default class CartsController {
  public async index({ auth }: HttpContextContract) {
    if (auth.user) {
      const carts = await Cart.query().where('user_id', auth.user.id)
      return carts
    }
  }

  public async add({ logger, auth, request }: HttpContextContract) {
    const reqBody = await request.validate({
      schema: schema.create({
        product_id: schema.number([rules.required()]),
        count: schema.number([rules.required()])
      })
    })
    logger.debug(JSON.stringify(reqBody))
    if (auth.user) {
      const cart = await Cart.firstOrNew({ productId: reqBody.product_id, userId: auth.user.id }, { count: 0 })
      cart.count += reqBody.count
      return await cart.save()
    }
  }

  public async del({ auth, request }: HttpContextContract) {
    // 不存在的 id 不处理
    const { ids } = request.only(['ids'])
    const idList = ids.split(',').map((id: string) => parseInt(id))
    const carts = await Cart.findMany(idList)
    return await Promise.all(
      carts.map(async (cart: Cart) => {
        if (auth.user && cart.userId === auth.user.id) {
          await cart.delete()
          return {id: cart.id, deleted: true}
        } else {
          return {id: cart.id, deleted: false, reason: '无访问权限'}
        }
      })
    )
  }
}
