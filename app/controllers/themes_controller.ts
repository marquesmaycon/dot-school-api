import type { HttpContext } from '@adonisjs/core/http'

import Theme from '#models/theme'
import { createThemeValidator, updateThemeValidator } from '#validators/theme'

export default class ThemesController {
  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    const themes = await Theme.all()

    return response.ok(themes)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const body = await request.validateUsing(createThemeValidator)

    const theme = await Theme.create(body)

    return response.created(theme)
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    const theme = await Theme.findOrFail(params.id)

    return response.ok(theme)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const body = await request.validateUsing(updateThemeValidator)

    const theme = await Theme.findOrFail(params.id)
    await theme.merge(body).save()

    return response.ok(theme)
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const theme = await Theme.findOrFail(params.id)

    await theme.delete()

    return response.noContent()
  }
}
