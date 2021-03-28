import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import OrderForm from './OrderForm'

export default class OrderDetail extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public productId: number

  @column()
  public orderFormId: number

  @belongsTo(() => OrderForm)
  public orderForm: BelongsTo<typeof OrderForm>

  @column()
  public count: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
