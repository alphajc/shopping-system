import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

import axios from "axios"
import { warehouse_addr } from "Config/service"

export default class ProductsController {
  public async index({ logger, request, params, response }: HttpContextContract) {
    logger.debug('ProductsController.index')
    if (params.id) {
      const resp = await axios.get(`${warehouse_addr}/product/${params.id}`)

      response.json(resp.data)
    } else {
      const { q } = request.get()
      logger.info(`search: ${q}`)
      const resp = await axios.get(`${warehouse_addr}/product?q=${q||''}`)

      response.json(resp.data)
    }
  }

  public async adminIndex({ logger, auth, response }: HttpContextContract) {
    logger.debug('ProductsController.adminIndex')
    const uid = auth.user ? auth.user.id : 0
    const resp = await axios.get(`${warehouse_addr}/admin/${uid}/product`)

    response.json(resp.data)
  }

  /**
   * 上架货品
   */
  public async online({ logger, auth, request, response }: HttpContextContract) {
    logger.debug('ProductsController.online')
    const productPayload = await request.validate({
      schema: schema.create({
        name: schema.string(),
        description: schema.string(),
        price: schema.number(),
        count: schema.number(),
      }),
    })

    const payload = auth.user ? {userId: auth.user.id, ...productPayload} : productPayload
    const resp = await axios.post(`${warehouse_addr}/product`, payload)

    response.json(resp.data)
  }

  /**
   * 下架货品
   */
  public async offline({ logger, auth, params, response }: HttpContextContract) {
    logger.debug('ProductsController.offline')
    const resp = await axios.get(`${warehouse_addr}/product/${params.id}`)
    if (auth.user && resp.data.user_id === auth.user.id) {
      await axios.delete(`${warehouse_addr}/product/${params.id}`)
    } else {
      response.status(403).send('Forbidden!')
    }
  }
}
