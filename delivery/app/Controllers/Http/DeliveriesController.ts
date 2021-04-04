import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Delivery from 'App/Models/Delivery'

export default class DeliveriesController {
  public async index({ logger, params }: HttpContextContract) {
    logger.debug(params.order_id)
    const res = await Delivery.query().where('order_form_id', params.order_id)
    logger.debug(JSON.stringify(res))
    return res
  }
}
