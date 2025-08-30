import type { HttpContext } from '@adonisjs/core/http'

import Class from '#models/class'
import { createClassValidator, updateClassValidator } from '#validators/class'

export default class ClassesController {
  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    const classes = await Class.all()

    return response.ok(classes)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const body = await request.validateUsing(createClassValidator)

    const classRecord = await Class.create(body)

    return response.created(classRecord)
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    const classRecord = await Class.findOrFail(params.id)

    return response.ok(classRecord)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const body = await request.validateUsing(updateClassValidator)

    const classRecord = await Class.findOrFail(params.id)
    await classRecord.merge(body).save()

    return response.ok(classRecord)
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const classRecord = await Class.findOrFail(params.id)
    await classRecord.delete()
    return response.noContent()
  }
}
