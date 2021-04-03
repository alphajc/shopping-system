/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

import Redis from '@ioc:Adonis/Addons/Redis'
import Delivery from 'App/Models/Delivery'
import Logger from '@ioc:Adonis/Core/Logger'

interface Invoice {
  orderFormId: number
  username: string
  address: string
  mobile: string
}

Redis.subscribe('order:delivery', async (message: string) => {
  const invoice: Invoice = JSON.parse(message)
  const delivery = new Delivery()
  delivery.orderFormId = invoice.orderFormId
  delivery.username = invoice.username
  delivery.address = invoice.address
  delivery.mobile = invoice.mobile
  delivery.detail = '正在出库'
  await delivery.save()
  Logger.info(`订单 ${delivery.orderFormId} 正在准备发货`)
})
