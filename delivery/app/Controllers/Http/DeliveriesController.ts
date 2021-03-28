import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Delivery from 'App/Models/Delivery'

export default class DeliveriesController {
    public async index({ params, response }: HttpContextContract) {
        const deliveries = await Delivery.query().where('order_form', params.order_id)
        response.json(deliveries.map(delivery => delivery.serialize()))
    }
}
