import factory from '@adonisjs/lucid/factories'

import Course from '#models/course'

import { ClassFactory } from './class_factory.js'
import { ThemeFactory } from './theme_factory.js'

export const CourseFactory = factory
  .define(Course, async ({ faker }) => {
    return {
      title: faker.commerce.department(),
      description: faker.lorem.paragraph(),
      imgUrl: faker.image.urlPicsumPhotos(),
    }
  })
  .relation('classes', () => ClassFactory)
  .relation('themes', () => ThemeFactory)
  .build()
