import { BaseSchema } from '@adonisjs/lucid/schema'

import { ClassStatus } from '#enums/class_status'

export default class extends BaseSchema {
  protected tableName = 'classes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('title').notNullable()
      table.string('description').notNullable()
      table.integer('vacancies').notNullable().unsigned()
      table
        .enum('status', Object.values(ClassStatus))
        .notNullable()
        .defaultTo(ClassStatus.AVAILABLE)
      table.date('start_date').notNullable()
      table.date('end_date').notNullable()
      table.integer('course_id').references('courses.id').onDelete('SET NULL').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
