import factory from '@adonisjs/lucid/factories'

import User from '#models/user'

import { ClassFactory } from './class_factory.js'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
    }
  })
  .relation('classes', () => ClassFactory)
  .build()
