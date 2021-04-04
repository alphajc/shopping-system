import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios from 'axios'
import { delivery_addr } from 'Config/service'

export default class DeliveriesController {
  public async index({ logger, params }: HttpContextContract) {
    logger.debug(params.order_id)
    const resp = await axios.get(`${delivery_addr}/orders/${params.order_id}/deliveries`)
    logger.debug(resp.data)
    return resp.data
  }
}
