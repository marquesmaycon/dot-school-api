import type { HttpContext } from '@adonisjs/core/http'

import Course from '#models/course'
import { createCourseValidator, updateCourseValidator } from '#validators/course'

export default class CoursesController {
  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    const courses = await Course.all()

    return response.ok(courses)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const body = await request.validateUsing(createCourseValidator)

    const course = await Course.create(body)

    return response.created(course)
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    const course = await Course.findOrFail(params.id)

    return response.ok(course)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const body = await request.validateUsing(updateCourseValidator)

    const course = await Course.findOrFail(params.id)
    await course.merge(body).save()

    return response.ok(course)
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const course = await Course.findOrFail(params.id)

    await course.delete()

    return response.noContent()
  }
}
