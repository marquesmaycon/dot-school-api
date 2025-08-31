import type { HttpContext } from '@adonisjs/core/http'

import User from '#models/user'
import { createUserValidator, updateUserValidator } from '#validators/user'

export default class UsersController {
  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    const users = await User.all()

    return response.ok(users)
  }

  async courses({ request, response }: HttpContext) {
    const { search } = request.qs()
    const users = await User.query()
      .select('id', 'name', 'email')
      .if(search, (query) =>
        query.where((q) => {
          if (search) {
            q.where('name', 'like', `%${search}%`).orWhere('email', 'like', `%${search}%`)
          }
        })
      )
      .whereHas('classes', (query) => query.select('id', 'title', 'courseId'))
      .preload('classes', (query) =>
        query.select('id', 'title', 'courseId').preload('course', (qr) => qr.select('id', 'title'))
      )

    return response.ok(users)
  }

  /**
   * Handle form submission for the create action'
   */
  async store({ request, response }: HttpContext) {
    const body = await request.validateUsing(createUserValidator)

    const user = await User.create(body)

    return response.created(user)
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)

    return response.ok(user)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const body = await request.validateUsing(updateUserValidator)

    const user = await User.findOrFail(params.id)
    await user.merge(body).save()

    return response.ok(user)
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)

    await user.delete()

    return response.noContent()
  }
}
