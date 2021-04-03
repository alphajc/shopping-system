import { Exception } from '@poppinss/utils'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new NoAuthException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class NoAuthException extends Exception {
  constructor (message: string) {
    super(message, 403, 'E_NO_SUFFICIENT_PERMISSION')
  }

  public async handle(error: NoAuthException, { response }: HttpContextContract) {
    response.status(error.status).send(error.message)
  }
}
