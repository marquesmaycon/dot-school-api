import factory from '@adonisjs/lucid/factories'
import { DateTime } from 'luxon'
import type { Faker } from '@faker-js/faker'

import Class from '#models/class'
import { ClassStatus } from '#enums/class_status'

import { CourseFactory } from './course_factory.js'
import { UserFactory } from './user_factory.js'

const generatePastDates = (faker: Faker) => {
  const startDate = faker.date.past({ years: 1 })
  const endDate = faker.date.recent({ refDate: startDate, days: 300 })
  return { startDate: DateTime.fromJSDate(startDate), endDate: DateTime.fromJSDate(endDate) }
}

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
  .state('finished', (klass, { faker }) => {
    const { startDate, endDate } = generatePastDates(faker)
    klass.startDate = startDate
    klass.endDate = endDate
    klass.status = ClassStatus.FINISHED
  })
  .state('done', (klass, { faker }) => {
    const { startDate, endDate } = generatePastDates(faker)
    klass.startDate = startDate
    klass.endDate = endDate
    klass.status = ClassStatus.FINISHED
  })
  .state('notStarted', (klass, { faker }) => {
    const startDate = faker.date.soon({ days: 20 })
    const endDate = faker.date.soon({ refDate: startDate, days: 30 })
    klass.startDate = DateTime.fromJSDate(startDate)
    klass.endDate = DateTime.fromJSDate(endDate)
  })
  .build()
