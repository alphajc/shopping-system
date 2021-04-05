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
| new NoValidProductException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class NoValidProductException extends Exception {
  constructor(message: string) {
    super(message, 428, 'E_NO_VALID_PRODUCT')
  }

  public async handle(error: this, { response }: HttpContextContract) {
    response.status(error.status).send(error.message)
  }
}
