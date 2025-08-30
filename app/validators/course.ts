import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new course.
 */
export const createCourseValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(3).maxLength(255).unique({
      table: 'courses',
      column: 'title',
    }),
    description: vine.string().minLength(10).maxLength(255),
    imgUrl: vine.string().minLength(1),
    themes: vine
      .array(
        vine.string().exists({
          table: 'themes',
          column: 'id',
        })
      )
      .minLength(1),
  })
)

/**
 * Validator to validate the payload when updating
 * an existing course.
 */
export const updateCourseValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(3).maxLength(255).unique({
      table: 'courses',
      column: 'title',
    }),
    description: vine.string().minLength(10).maxLength(255),
    imgUrl: vine.string().minLength(1),
    themes: vine
      .array(
        vine.string().exists({
          table: 'themes',
          column: 'id',
        })
      )
      .minLength(1),
  })
)
