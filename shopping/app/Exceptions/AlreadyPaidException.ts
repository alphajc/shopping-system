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
| new AlreadyPaidException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class AlreadyPaidException extends Exception {
  constructor(message: string) {
    super(message, 409, 'E_ALREADY_PAID')
  }

  public async handle(error: AlreadyPaidException, { response }: HttpContextContract) {
    response.status(error.status).send(error.message)
  }
}
