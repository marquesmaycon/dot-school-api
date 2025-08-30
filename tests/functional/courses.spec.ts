import db from '@adonisjs/lucid/services/db'
import { test } from '@japa/runner'

import { ThemeFactory } from '#database/factories/theme_factory'
import { CourseFactory } from '#database/factories/course_factory'

test.group('Courses', (group) => {
  group.each.setup(async () => {
    await db.beginGlobalTransaction()
  })

  group.each.teardown(async () => {
    await db.rollbackGlobalTransaction()
  })

  // TO DO => testar endpoint availableCourses

  test('it should create courses with valid data', async ({ client }) => {
    const theme = await ThemeFactory.create()
    const course = await CourseFactory.make()

    const payload = {
      ...course.serialize(),
      themes: [theme.id],
    }

    const response = await client.post('/courses').json(payload)

    response.assertStatus(201)
    response.assertBodyContains({ title: course.title })
  })

  test('it should not create courses without a title', async ({ client }) => {
    const theme = await ThemeFactory.create()
    const course = await CourseFactory.make()

    const payload = {
      ...course.serialize(),
      title: '',
      themes: [theme.id],
    }
    const response = await client.post('/courses').json(payload)

    response.assertStatus(422)
    response.assertBodyContains({ errors: [{ field: 'title' }] })
  })

  test('it should not create courses without a description', async ({ client }) => {
    const theme = await ThemeFactory.create()
    const course = await CourseFactory.make()

    const payload = {
      ...course.serialize(),
      description: '',
      themes: [theme.id],
    }
    const response = await client.post('/courses').json(payload)

    response.assertStatus(422)
    response.assertBodyContains({ errors: [{ field: 'description' }] })
  })

  test('it should not create courses without a img url', async ({ client }) => {
    const theme = await ThemeFactory.create()
    const course = await CourseFactory.make()

    const payload = {
      ...course.serialize(),
      imgUrl: '',
      themes: [theme.id],
    }
    const response = await client.post('/courses').json(payload)

    response.assertStatus(422)
    response.assertBodyContains({ errors: [{ field: 'imgUrl' }] })
  })

  test('it should not create courses without a theme', async ({ client }) => {
    const course = await CourseFactory.make()
    const response = await client.post('/courses').json(course)

    response.assertStatus(422)
    response.assertBodyContains({ errors: [{ field: 'themes' }] })
  })

  test('it should not create courses with the same title', async ({ client }) => {
    const uniqueTitle = 'Unique Course Title'
    const theme = await ThemeFactory.create()
    await CourseFactory.tap((c) => (c.title = uniqueTitle)).create()
    const otherCourse = await CourseFactory.tap((c) => (c.title = uniqueTitle)).make()

    const payload = {
      ...otherCourse.serialize(),
      themes: [theme.id],
    }

    const response = await client.post('/courses').json(payload)

    response.assertStatus(422)
    response.assertBodyContains({ errors: [{ field: 'title', rule: 'database.unique' }] })
  })

  test('it should not update courses with the an existing title', async ({ client }) => {
    const theme = await ThemeFactory.create()
    const [courseA, courseB] = await CourseFactory.createMany(2)

    const payload = {
      ...courseB.serialize(),
      title: courseA.title,
      themes: [theme.id],
    }

    const response = await client.post('/courses').json(payload)

    response.assertStatus(422)
    response.assertBodyContains({ errors: [{ field: 'title', rule: 'database.unique' }] })
  })
})
