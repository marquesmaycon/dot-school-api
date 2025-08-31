import { BaseSeeder } from '@adonisjs/lucid/seeders'

import { CourseFactory } from '#database/factories/course_factory'
import { ThemeFactory } from '#database/factories/theme_factory'
import { UserFactory } from '#database/factories/user_factory'

export default class extends BaseSeeder {
  async run() {
    await UserFactory.createMany(10)
    const themes = await ThemeFactory.merge([
      { title: 'Inovação' },
      { title: 'Tecnologia' },
      { title: 'Marketing' },
      { title: 'Empreendedorismo' },
      { title: 'Agro' },
    ]).createMany(5)

    const randomUserNumber = () => Math.floor(Math.random() * 11)

    const courses = await CourseFactory.with('classes', 2, (builder) =>
      builder.with('users', randomUserNumber())
    )
      .with('classes', 1, (builder) => builder.with('users', randomUserNumber()).apply('done'))
      .with('classes', 1, (builder) => builder.apply('notStarted'))
      .createMany(6)

    await Promise.all(
      courses.map(async (course) => {
        const randomThemes = themes
          .sort(() => 0.5 - Math.random())
          .slice(0, 1)
          .map((theme) => theme.id)
        await course.related('themes').attach(randomThemes)
      })
    )
  }
}
