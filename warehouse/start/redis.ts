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
import Product from 'App/Models/Product'
import Logger from '@ioc:Adonis/Core/Logger'

interface Shipment {
  product: number
  count: number
}

Redis.subscribe('order:warehouse', async (message: string) => {
  const orderDetails: [Shipment] = JSON.parse(message)
  for (let od of orderDetails) {
    let product = await Product.findOrFail(od.product)
    product.count -= od.count
    await product.save()
    Logger.info(`${product.name} 已售出 ${od.count}，商品正在出库，当前还剩 ${product.count}`)
  }
})
