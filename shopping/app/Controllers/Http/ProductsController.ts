import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import NoAuthException from 'App/Exceptions/NoAuthException'

import axios from "axios"
import { warehouse_addr } from "Config/service"

export default class ProductsController {
  public async index({ logger, request, params }: HttpContextContract) {
    logger.debug('ProductsController.index')
    if (params.id) {
      const resp = await axios.get(`${warehouse_addr}/product/${params.id}`)

      return resp.data
    } else {
      const { q } = request.get()
      logger.info(`search: ${q}`)
      const resp = await axios.get(`${warehouse_addr}/product?q=${q||''}`)

      return resp.data
    }
  }

  public async adminIndex({ logger, auth }: HttpContextContract) {
    logger.debug('ProductsController.adminIndex')
    const uid = auth.user ? auth.user.id : 0
    const resp = await axios.get(`${warehouse_addr}/admin/${uid}/product`)

    return resp.data
  }

  /**
   * 上架货品
   */
  public async online({ logger, auth, request }: HttpContextContract) {
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

    return resp.data
  }

  /**
   * 下架货品
   */
  public async offline({ logger, auth, params }: HttpContextContract) {
    logger.debug('ProductsController.offline')
    const resp = await axios.get(`${warehouse_addr}/product/${params.id}`)
    if (auth.user && resp.data.user_id === auth.user.id) {
      await axios.delete(`${warehouse_addr}/product/${params.id}`)
    } else {
      throw new NoAuthException('不具备该商品的操作权限！')
    }
  }
}
