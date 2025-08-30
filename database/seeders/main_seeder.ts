import { BaseSeeder } from '@adonisjs/lucid/seeders'

import { CourseFactory } from '#database/factories/course_factory'
import { ThemeFactory } from '#database/factories/theme_factory'
import { UserFactory } from '#database/factories/user_factory'

// TO DO => alterar o seeder para atender aos criterios do pdf. Exemplo: um aluno nao pode estar em 2 turmas do mesmo curso

export default class extends BaseSeeder {
  async run() {
    const users = await UserFactory.createMany(100)
    const themes = await ThemeFactory.createMany(15)
    const courses = await CourseFactory.with('classes', 2)
      .with('classes', 1, (builder) => builder.apply('done'))
      .createMany(5)

    await Promise.all(
      courses.map(async (course) => {
        const randomThemes = themes
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
          .map((theme) => theme.id)
        await course.related('themes').attach(randomThemes)
      })
    )

    const classes = courses.flatMap((course) => course.classes)

    await Promise.all(
      classes.map(async (klass) => {
        const randomUsers = users
          .sort(() => 0.5 - Math.random())
          .slice(0, 15)
          .map((user) => user.id)
        await klass.related('users').attach(randomUsers)
      })
    )
  }
}
