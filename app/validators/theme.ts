import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new theme.
 */
export const createThemeValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(3).maxLength(255).unique({
      table: 'themes',
      column: 'title',
    }),
  })
)

/**
 * Validator to validate the payload when updating
 * an existing theme.
 */
export const updateThemeValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(3).maxLength(255).unique({
      table: 'themes',
      column: 'title',
    }),
  })
)
