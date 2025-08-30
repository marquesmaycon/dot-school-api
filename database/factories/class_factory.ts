import factory from '@adonisjs/lucid/factories'
import { DateTime } from 'luxon'

import Class from '#models/class'
import { ClassStatus } from '#enums/class_status'

import { CourseFactory } from './course_factory.js'
import { UserFactory } from './user_factory.js'

export const ClassFactory = factory
  .define(Class, async ({ faker }) => {
    const startDate = faker.date.recent({ days: 3 })
    const endDate = faker.date.soon({ refDate: startDate, days: 30 })
    return {
      title: faker.person.jobArea(),
      description: faker.lorem.sentence(),
      vacancies: faker.number.int({ min: 10, max: 30 }),
      startDate: DateTime.fromJSDate(startDate),
      endDate: DateTime.fromJSDate(endDate),
      status: ClassStatus.AVAILABLE,
    }
  })
  .relation('course', () => CourseFactory)
  .relation('users', () => UserFactory)
  .state('finished', () => ({
    status: ClassStatus.FINISHED,
  }))
  .state('notStarted', (klass, { faker }) => {
    const startDate = faker.date.soon({ days: 20 })
    const endDate = faker.date.soon({ refDate: startDate, days: 30 })
    klass.startDate = DateTime.fromJSDate(startDate)
    klass.endDate = DateTime.fromJSDate(endDate)
  })
  .state('done', (klass, { faker }) => {
    const startDate = faker.date.past({ years: 1 })
    const endDate = faker.date.recent({ refDate: startDate, days: 300 })
    klass.startDate = DateTime.fromJSDate(startDate)
    klass.endDate = DateTime.fromJSDate(endDate)
    klass.status = ClassStatus.FINISHED
  })
  .build()
