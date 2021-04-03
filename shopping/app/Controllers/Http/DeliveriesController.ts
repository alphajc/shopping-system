import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios from 'axios'
import { delivery_addr } from 'Config/service'

export default class DeliveriesController {
  public async index({ params }: HttpContextContract) {
    const resp = await axios.get(`${delivery_addr}/delivery/${params.order_id}`)
    return resp.data
  }
}
