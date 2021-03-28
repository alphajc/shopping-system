import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Carts extends BaseSchema {
  protected tableName = 'carts'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().notNullable()
      table.integer('product').unsigned().notNullable()
      table.integer('count').notNullable()
      table.timestamps(true, true)
      table.foreign('user_id').references('users.id')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
