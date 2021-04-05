/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import HealthCheck from '@ioc:Adonis/Core/HealthCheck'
import Route from '@ioc:Adonis/Core/Route'

Route.get('/healthz', async ({ response }) => {
  const isLive = await HealthCheck.isLive()

  return isLive ? response.status(200).send({}) : response.status(400).send({})
})

Route.get('/', async ({ logger, auth }) => {
  logger.info(`uid: ${auth.user?.id}`)
  return { hello: 'world' }
}).middleware('auth')

Route.post('/register', 'AuthController.register')
Route.post('/login', 'AuthController.login')
Route.post('/logout', 'AuthController.logout').middleware('auth')

Route.get('/orders/:id?', 'OrdersController.index').where('id', /^[0-9]+$/).middleware('auth')
Route.post('/orders', 'OrdersController.order').middleware('auth')
Route.patch('/orders/:id/payment', 'OrdersController.confirmPaid').middleware('auth')
Route.get('/orders/:order_id/deliveries', 'DeliveriesController.index').where('order_id', /^[0-9]+$/).middleware('auth')

Route.get('/product/:id?', 'ProductsController.index').where('id', /^[0-9]+$/).middleware('auth')
Route.post('/product', 'ProductsController.online').middleware('auth')
Route.delete('/product/:id', 'ProductsController.offline').where('id', /^[0-9]+$/).middleware('auth')
Route.get('/admin/product', 'ProductsController.adminIndex').middleware('auth')

Route.get('/carts', 'CartsController.index').middleware('auth')
Route.post('/carts', 'CartsController.add').middleware('auth')
Route.delete('/carts', 'CartsController.del').middleware('auth')
