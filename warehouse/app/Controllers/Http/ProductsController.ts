import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Product from 'App/Models/Product'

export default class ProductsController {
  public async index({ logger, request, params, response }: HttpContextContract) {
    logger.debug('ProductsController.index')
    logger.debug(request.completeUrl(true))
    if (params.id) {
      const product = await Product.findOrFail(params.id)

      response.json(product.serialize())
    } else {
      const { q } = request.get()
      logger.info(`search: ${q}`)
      const product = await (!!q
        ? Product.query().where('name', 'like', `%${q}%`)
        : Product.query())

      response.json(product)
    }
  }

  public async adminIndex({ logger, params, response }: HttpContextContract) {
    logger.debug('ProductsController.adminIndex')
    logger.info(`uid:${params.uid}`)
    const product = await (!!params.uid
      ? Product.query().where('user_id', params.uid)
      : Product.query())

    response.json(product)
  }

  /**
   * 上架货品
   */
  public async online({ logger, request, response }: HttpContextContract) {
    logger.debug('ProductsController.online')
    const productPayload = await request.validate({
      schema: schema.create({
        name: schema.string(),
        userId: schema.number(),
        description: schema.string(),
        price: schema.number(),
        count: schema.number(),
      }),
    })

    const product = new Product()
    product.name = productPayload.name
    product.description = productPayload.description
    product.price = productPayload.price
    product.count = productPayload.count
    product.userId = productPayload.userId

    response.json(await product.save())
  }

  /**
   * 下架货品
   */
  public async offline({ logger, params, response }: HttpContextContract) {
    logger.debug('ProductsController.offline')
    const product = await Product.findOrFail(params.id)
    response.json(await product.delete())
  }
}
