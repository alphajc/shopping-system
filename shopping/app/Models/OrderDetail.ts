import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import OrderForm from './OrderForm'
import { BelongsTo } from '@ioc:Adonis/Lucid/Relations'

export default class OrderDetail extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public productId: number

  @belongsTo(() => OrderForm)
  public orderForm: BelongsTo<typeof OrderForm>

  @column()
  public count: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
