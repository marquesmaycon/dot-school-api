import db from '@adonisjs/lucid/services/db'
import { test } from '@japa/runner'

import Theme from '#models/theme'

test.group('Themes', (group) => {
  group.each.setup(async () => {
    await db.beginGlobalTransaction()
  })

  group.each.teardown(async () => {
    await db.rollbackGlobalTransaction()
  })

  test('{$i} it should not create themes without a title - title: "{title}"')
    .with([{ title: '' }, { title: null }, { title: undefined }])
    .run(async ({ client }, title) => {
      const response = await client.post('/themes').json(title)

      response.assertStatus(422)
    })

  test('it should not create themes with the same title', async ({ client }) => {
    const themeTitle = 'My_Theme_01'
    await Theme.create({ title: themeTitle })

    const response = await client.post('/themes').json({ title: themeTitle })

    response.assertStatus(422)
  })
})
