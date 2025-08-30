import Theme from '#models/theme'
import type { HttpContext } from '@adonisjs/core/http'

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
    const { title } = request.body()
    const theme = await Theme.create({ title })
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
    const theme = await Theme.findOrFail(params.id)
    await theme.merge(request.body()).save()
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
