import factory from '@adonisjs/lucid/factories'
import { DateTime } from 'luxon'

import Class from '#models/class'
import { ClassStatus } from '#enums/class_status'

import { CourseFactory } from './course_factory.js'
import { UserFactory } from './user_factory.js'

export const ClassFactory = factory
  .define(Class, async ({ faker }) => {
    const startDate = faker.date.soon()
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
  .build()
