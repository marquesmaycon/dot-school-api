import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

import Class from '#models/class'
import User from '#models/user'
import { ClassStatus } from '#enums/class_status'
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

  async assignUser({ params, request, response }: HttpContext) {
    const { classId } = params
    const { email } = request.body()

    const user = await User.findByOrFail('email', email)

    const classRecord = await Class.findOrFail(classId)

    await classRecord.load('course', (query) =>
      query.preload('classes', (qry) => qry.preload('users'))
    )

    const courseClasses = classRecord.course.classes

    const userAlreadyAssigned = courseClasses.some((cls) => cls.users.some((u) => u.id === user.id))

    if (userAlreadyAssigned) {
      return response.badRequest({ message: 'User is already assigned to a class in this course' })
    }

    if (classRecord.status === ClassStatus.FINISHED) {
      return response.badRequest({ message: 'Cannot assign user to a finished class' })
    }

    const today = DateTime.now()
    if (today < classRecord.startDate || today > classRecord.endDate) {
      return response.badRequest({ message: 'Cannot assign user to class outside of its schedule' })
    }

    await classRecord.related('users').attach([user.id])
    await classRecord.load('users')

    return response.ok(classRecord)
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
