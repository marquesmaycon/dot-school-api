import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

import { ClassStatus } from '#enums/class_status'

/**
 * Validator to validate the payload when creating
 * a new class.
 */
export const createClassValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(3).maxLength(255).unique({
      table: 'classes',
      column: 'title',
    }),
    description: vine.string().minLength(10).maxLength(255),
    vacancies: vine.number().min(0),
    startDate: vine.date().transform((v) => DateTime.fromJSDate(v)),
    endDate: vine.date().transform((v) => DateTime.fromJSDate(v)),
    courseId: vine.number().exists({ table: 'courses', column: 'id' }),
  })
)

/**
 * Validator to validate the payload when updating
 * an existing class.
 */
export const updateClassValidator = vine.compile(
  vine.object({
    id: vine.number(),
    title: vine
      .string()
      .minLength(3)
      .maxLength(255)
      .unique(async (db, value, field) => {
        const row = await db
          .from('classes')
          .where('title', value)
          .andWhereNot('id', field.parent.id)
          .first()
        return row === null
      }),
    description: vine.string().minLength(10).maxLength(255),
    vacancies: vine.number().min(0),
    status: vine.enum(ClassStatus),
    startDate: vine.date().transform((v) => DateTime.fromJSDate(v)),
    endDate: vine.date().transform((v) => DateTime.fromJSDate(v)),
    courseId: vine.number().exists({ table: 'courses', column: 'id' }),
  })
)
