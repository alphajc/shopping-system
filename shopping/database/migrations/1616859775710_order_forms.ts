import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class OrderForms extends BaseSchema {
  protected tableName = 'order_forms'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().notNullable()
      table.float('price').notNullable()
      table.string('address', 255)
      table.enu('pay_stat', ['paid', 'no_pay']).defaultTo('no_pay')
      table.string('mobile')
      table.foreign('user_id').references('users.id')
      table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
