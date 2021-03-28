import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Delivery extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public orderFormId: number

  @column()
  public address: string

  @column()
  public mobile: string

  @column()
  public username: string

  @column()
  public detail: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
