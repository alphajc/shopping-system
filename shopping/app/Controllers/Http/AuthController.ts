// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async register ({ request, auth, response }: HttpContextContract) {
    /**
     * Validate user details
     */
    const validationSchema = schema.create({
      username: schema.string({ trim: true }, [
        rules.unique({ table: 'users', column: 'username' }),
      ]),
      password: schema.string({ trim: true }, [
        rules.confirmed(),
      ])
    })

    const userDetails = await request.validate({
      schema: validationSchema,
    })

    /**
     * Create a new user
     */
    const user = new User()
    user.username = userDetails.username
    user.password = userDetails.password
    await user.save()

    await auth.login(user)
    response.json(auth)
  }
  public async login ({ auth, request, response }: HttpContextContract) {
    const username = request.input('username')
    const password = request.input('password')
    const rememberUser = !!request.input('remember_me')
    
    response.json(await auth.attempt(username, password, rememberUser))
  }
  public async logout ({ auth, response }: HttpContextContract) {
    
    response.send(await auth.logout())
  }
}