import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Deliveries extends BaseSchema {
  protected tableName = 'deliveries'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('order_form_id').unsigned()
      table.string('username', 255).notNullable()
      table.string('address', 255).notNullable()
      table.string('mobile', 15).notNullable()
      table.text('detail').defaultTo('正在出库')
      table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
