import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class OrderDetails extends BaseSchema {
  protected tableName = 'order_details'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('product_id').unsigned().notNullable()
      table.integer('order_form_id').unsigned().notNullable()
      table.integer('count').notNullable()
      table.foreign('order_form_id').references('order_forms.id')
      table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
