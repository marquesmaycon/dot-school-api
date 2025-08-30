import db from '@adonisjs/lucid/services/db'
import { test } from '@japa/runner'

import { ThemeFactory } from '#database/factories/theme_factory'
import { CourseFactory } from '#database/factories/course_factory'

const makeCoursesPayload = async (overrides = {}) => {
  const theme = await ThemeFactory.create()
  const course = await CourseFactory.make()

  return {
    ...course.serialize(),
    themes: [theme.id],
    ...overrides,
  }
}

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

  test('it should update courses with valid data', async ({ client }) => {
    const course = await CourseFactory.with('themes', 1).create()
    await course.load('themes')

    console.log(course)

    const payload = {
      ...course.serialize(),
      themes: [course.themes[0].id],
      description: 'Updated Course Description',
    }

    const response = await client.put(`/courses/${course.id}`).json(payload)

    console.log(response.body())
    response.assertStatus(200)
    response.assertBodyContains({ description: payload.description })
  })

  test('it should not create courses without a valid title')
    .with(['', 'a', 'ab', 'a'.repeat(256)])
    .run(async ({ client }, title) => {
      const payload = await makeCoursesPayload({ title })
      const response = await client.post('/courses').json(payload)

      response.assertStatus(422)
      response.assertBodyContains({ errors: [{ field: 'title' }] })
    })

  test('it should not create courses without a valid description')
    .with(['', 'a', 'abcdefghi', 'a'.repeat(256)])
    .run(async ({ client }, description) => {
      const payload = await makeCoursesPayload({ description })
      const response = await client.post('/courses').json(payload)

      response.assertStatus(422)
      response.assertBodyContains({ errors: [{ field: 'description' }] })
    })

  test('it should not create courses without a valid imgUrl')
    .with(['', 'invalidUrl', 'https://'])
    .run(async ({ client }, imgUrl) => {
      const payload = await makeCoursesPayload({ imgUrl })
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
    await CourseFactory.tap((c) => (c.title = uniqueTitle)).create()

    const payload = await makeCoursesPayload({ title: uniqueTitle })
    const response = await client.post('/courses').json(payload)

    response.assertStatus(500)
  })

  test('it should not update courses with an existing title', async ({ client }) => {
    const theme = await ThemeFactory.create()
    const [courseA, courseB] = await CourseFactory.createMany(2)

    const payload = {
      ...courseB.serialize(),
      title: courseA.title,
      themes: [theme.id],
    }

    const response = await client.post('/courses').json(payload)

    response.assertStatus(500)
  })
})
