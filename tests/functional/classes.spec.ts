import db from '@adonisjs/lucid/services/db'
import { test } from '@japa/runner'

import { DateTime } from 'luxon'

import { CourseFactory } from '#database/factories/course_factory'
import { ClassFactory } from '#database/factories/class_factory'
import { UserFactory } from '#database/factories/user_factory'

const makeClassPayload = async (overrides = {}) => {
  const course = await CourseFactory.create()
  const classRecord = await ClassFactory.with('course').make()
  return {
    ...classRecord.serialize(),
    courseId: course.id,
    ...overrides,
  }
}

test.group('Classes', (group) => {
  group.each.setup(async () => {
    await db.beginGlobalTransaction()
  })

  group.each.teardown(async () => {
    await db.rollbackGlobalTransaction()
  })

  test('it should create a class with valid data', async ({ client }) => {
    const title = 'Math 101'
    const payload = await makeClassPayload({ title })

    const response = await client.post('/classes').json(payload)

    response.assertStatus(201)
    response.assertBodyContains({ title })
  })

  test('{$i} it should not create classes without a valid title - title: "{$self}"')
    .with(['', 'a', 'ab', 'a'.repeat(256)])
    .run(async ({ client }, title) => {
      const payload = await makeClassPayload({ title })
      const response = await client.post('/classes').json(payload)

      response.assertStatus(422)
      response.assertBodyContains({ errors: [{ field: 'title' }] })
    })

  test('{$i} it should not create classes without a valid description - description: "{$self}"')
    .with(['', 'a', 'abcdefghi', 'a'.repeat(256)])
    .run(async ({ client }, description) => {
      const payload = await makeClassPayload({ description })
      const response = await client.post('/classes').json(payload)

      response.assertStatus(422)
      response.assertBodyContains({ errors: [{ field: 'description' }] })
    })

  test('{$i} it should not create classes without a valid vacancies - vacancies: "{$self}"')
    .with([-1, Number.NaN, 'string', null])
    .run(async ({ client }, vacancies) => {
      const payload = await makeClassPayload({ vacancies })
      const response = await client.post('/classes').json(payload)

      response.assertStatus(422)
      response.assertBodyContains({ errors: [{ field: 'vacancies' }] })
    })

  test('{$i} it should not create classes without a valid startDate - startDate: "{$self}"')
    .with([1, 'string', null, new Date(), DateTime.now()])
    .run(async ({ client }, startDate) => {
      const payload = await makeClassPayload({ startDate })
      const response = await client.post('/classes').json(payload)

      response.assertStatus(422)
      response.assertBodyContains({ errors: [{ field: 'startDate' }] })
    })

  test('{$i} it should not create classes without a valid endDate - endDate: "{$self}"')
    .with([1, 'string', null, new Date(), DateTime.now()])
    .run(async ({ client }, endDate) => {
      const payload = await makeClassPayload({ endDate })
      const response = await client.post('/classes').json(payload)

      response.assertStatus(422)
      response.assertBodyContains({ errors: [{ field: 'endDate' }] })
    })

  test('it should not create classes with the same title', async ({ client }) => {
    const uniqueTitle = 'Unique Class Title'
    await ClassFactory.tap((c) => (c.title = uniqueTitle))
      .with('course')
      .create()

    const payload = await makeClassPayload({ title: uniqueTitle })
    const response = await client.post('/classes').json(payload)

    response.assertStatus(500)
  })

  test('it should not update classes with an existing title', async ({ client }) => {
    const [classA, classB] = await ClassFactory.with('course').createMany(2)
    await classB.load('course')

    const payload = {
      ...classB.serialize(),
      courseId: classB.course.id,
      title: classA.title,
    }

    const response = await client.post('/classes').json(payload)

    response.assertStatus(500)
  })

  test('it should not allow update a class without a valid status', async ({ client }) => {
    const classRecord = await ClassFactory.with('course').create()

    const payload = {
      ...classRecord.serialize(),
      status: 'invalid',
    }

    const response = await client.put(`/classes/${classRecord.id}`).json(payload)

    response.assertStatus(422)
    response.assertBodyContains({ errors: [{ field: 'status' }] })
  })

  test('it should allow assign a user to a class from a new course', async ({ client }) => {
    const classRecord = await ClassFactory.with('course').create()
    const user = await UserFactory.create()

    const payload = { email: user.email }

    const response = await client.post(`/classes/${classRecord.id}/users`).json(payload)

    response.assertOk()
    response.assertBodyContains({ users: [{ email: user.email }] })
  })

  test('it should not allow assign a user to a class from the same course', async ({ client }) => {
    const course = await CourseFactory.with('classes', 2).create()
    const [classA, classB] = course.classes

    const user = await UserFactory.create()
    await classA.related('users').attach([user.id])

    const payload = { email: user.email }

    const response = await client.post(`/classes/${classB.id}/users`).json(payload)

    response.assertBadRequest()
  })

  test('it should not allow assign a user to a class finished or out of date', async ({
    client,
  }) => {
    const course = await CourseFactory.with('classes', 1, (c) => c.apply('finished'))
      .with('classes', 1, (c) => c.apply('notStarted'))
      .create()
    const [classA, classB] = course.classes

    const user = await UserFactory.create()
    const payload = { email: user.email }

    const responseA = await client.post(`/classes/${classA.id}/users`).json(payload)
    const responseB = await client.post(`/classes/${classB.id}/users`).json(payload)

    responseA.assertBadRequest()
    responseB.assertBadRequest()
  })
})
