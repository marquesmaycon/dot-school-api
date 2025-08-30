import db from '@adonisjs/lucid/services/db'
import { test } from '@japa/runner'

import { UserFactory } from '#database/factories/user_factory'

test.group('Users', (group) => {
  group.each.setup(async () => {
    await db.beginGlobalTransaction()
  })

  group.each.teardown(async () => {
    await db.rollbackGlobalTransaction()
  })

  test('{$i} it should not create users without a name or email - name: "{name}", email: "{email}"')
    .with([
      { name: '', email: '' },
      { name: 'Maycon', email: '' },
      { name: '', email: 'mayconmarquesh@gmail.com' },
    ])
    .run(async ({ client }, { name, email }) => {
      const response = await client.post('/users').json({ name, email })

      response.assertStatus(422)
    })

  test('it should not create users with the same email', async ({ client }) => {
    const user = await UserFactory.create()

    const response = await client.post('/users').json({ name: 'John', email: user.email })

    response.assertStatus(422)
  })

  test('it should not update a user with a existing email', async ({ client }) => {
    const [user1, user2] = await UserFactory.createMany(2)

    const response = await client.put(`/users/${user2.id}`).json({ email: user1.email })

    response.assertStatus(422)
  })

  test('{$i} it should not create a user with and invalid email: "{$self}"')
    .with(['invalid-email', 'another-invalid-email'])
    .run(async ({ client }, email) => {
      const response = await client.post('/users').json({ name: 'John', email })

      response.assertStatus(422)
    })

  test(
    '{$i} it should not create a user with a name with less than 3 characters or more than 255 characters: "{$self}"'
  )
    .with(['ab', 'a', 'a'.repeat(256)])
    .run(async ({ client }, name) => {
      const response = await client.post('/users').json({ name, email: 'john@example.com' })

      response.assertStatus(422)
    })
})
