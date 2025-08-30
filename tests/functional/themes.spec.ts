import db from '@adonisjs/lucid/services/db'
import { test } from '@japa/runner'

import { ThemeFactory } from '#database/factories/theme_factory'

test.group('Themes', (group) => {
  group.each.setup(async () => {
    await db.beginGlobalTransaction()
  })

  group.each.teardown(async () => {
    await db.rollbackGlobalTransaction()
  })

  test('{$i} it should not create themes without a valid title - title: "{$self}"')
    .with(['', null, undefined])
    .run(async ({ client }, title) => {
      const response = await client.post('/themes').json({ title })

      response.assertStatus(422)
      response.assertBodyContains({ errors: [{ field: 'title' }] })
    })

  test('it should not create themes with the same title', async ({ client }) => {
    const themeTitle = 'Unique Theme Title'
    await ThemeFactory.tap((theme) => (theme.title = themeTitle)).create()

    const response = await client.post('/themes').json({ title: themeTitle })

    response.assertStatus(500)
  })
})
