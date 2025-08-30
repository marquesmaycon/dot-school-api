import db from '@adonisjs/lucid/services/db'
import { test } from '@japa/runner'

import { CourseFactory } from '#database/factories/course_factory'
import { ClassFactory } from '#database/factories/class_factory'
import { DateTime } from 'luxon'

const makeClassPayload = async (overrides = {}) => {
  const course = await CourseFactory.create()
  const classRecord = await ClassFactory.with('course').make()
  return {
    ...classRecord.serialize(),
    courseId: course.id,
    ...overrides,
  }
}

// TO DO => testar endpoint assignUser

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

  test('it should not create classes without a valid title')
    .with(['', 'a', 'ab', 'a'.repeat(256)])
    .run(async ({ client }, title) => {
      const payload = await makeClassPayload({ title })
      const response = await client.post('/classes').json(payload)

      response.assertStatus(422)
      response.assertBodyContains({ errors: [{ field: 'title' }] })
    })

  test('it should not create classes without a valid description')
    .with(['', 'a', 'abcdefghi', 'a'.repeat(256)])
    .run(async ({ client }, description) => {
      const payload = await makeClassPayload({ description })
      const response = await client.post('/classes').json(payload)

      response.assertStatus(422)
      response.assertBodyContains({ errors: [{ field: 'description' }] })
    })

  test('it should not create classes without a valid vacancies')
    .with([-1, Number.NaN, 'string', null])
    .run(async ({ client }, vacancies) => {
      const payload = await makeClassPayload({ vacancies })
      const response = await client.post('/classes').json(payload)

      response.assertStatus(422)
      response.assertBodyContains({ errors: [{ field: 'vacancies' }] })
    })

  test('it should not create classes without a valid startDate')
    .with([1, 'string', null, new Date(), DateTime.now()])
    .run(async ({ client }, startDate) => {
      const payload = await makeClassPayload({ startDate })
      const response = await client.post('/classes').json(payload)

      response.assertStatus(422)
      response.assertBodyContains({ errors: [{ field: 'startDate' }] })
    })

  test('it should not create classes without a valid endDate')
    .with([1, 'string', null, new Date(), DateTime.now()])
    .run(async ({ client }, endDate) => {
      const payload = await makeClassPayload({ endDate })
      const response = await client.post('/classes').json(payload)

      response.assertStatus(422)
      response.assertBodyContains({ errors: [{ field: 'endDate' }] })
    })

  test('it should not allow update a class without a valid status', async ({ client }) => {
    const classRecord = await ClassFactory.with('course').create()

    const payload = {
      ...classRecord.serialize(),
      status: 'invalid',
    }

    const response = await client.put(`/classes/${classRecord.id}`).json(payload)

    console.log(JSON.stringify(response.body(), null, 2))

    response.assertStatus(422)
    response.assertBodyContains({ errors: [{ field: 'status' }] })
  })
})
