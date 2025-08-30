import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new user.
 */
export const createUserValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3).maxLength(255),
    email: vine.string().email().maxLength(255).unique({
      table: 'users',
      column: 'email',
    }),
  })
)

/**
 * Validator to validate the payload when updating
 * an existing user.
 */
export const updateUserValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3).maxLength(255),
    email: vine.string().email().maxLength(255),
  })
)
