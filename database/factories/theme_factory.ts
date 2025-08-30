import factory from '@adonisjs/lucid/factories'

import Theme from '#models/theme'

import { CourseFactory } from './course_factory.js'

export const ThemeFactory = factory
  .define(Theme, async ({ faker }) => {
    return {
      title: faker.person.jobArea(),
    }
  })
  .relation('courses', () => CourseFactory)
  .build()
