/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const UsersController = () => import('#controllers/users_controller')
const CoursesController = () => import('#controllers/courses_controller')
const ClassesController = () => import('#controllers/classes_controller')
const ThemesController = () => import('#controllers/themes_controller')

router.resource('users', UsersController).apiOnly()
router.resource('courses', CoursesController).apiOnly()
router.resource('classes', ClassesController).apiOnly()
router.resource('themes', ThemesController).apiOnly()
