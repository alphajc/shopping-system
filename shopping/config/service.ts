import Env from '@ioc:Adonis/Core/Env'

export const warehouse_addr = Env.get('SERVICE_WAREHOUSE')
export const delivery_addr = Env.get('SERVICE_DELIVERY')
