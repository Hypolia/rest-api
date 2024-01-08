import { type HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CreateUserValidator } from 'App/authentication/validators/authentication_validator'
import AuthenticationService from 'App/authentication/services/authentication_service'
import Keycloak from '@ioc:Adonis/Auth/Keycloak'

export default class AuthenticationController {
  private authenticationService = AuthenticationService

  // public async login({ request, response, auth }: HttpContextContract) {
  //   const email = request.input('email')
  //   const password = request.input('password')

  //   try {
  //     const oat = await auth.attempt(email, password)
  //     response.cookie('token', oat.token, {
  //       httpOnly: true,
  //       secure: true,
  //     })
  //     return response.send(oat)
  //   } catch (error) {
  //     return response.unauthorized('Invalid credentials')
  //   }
  // }

  public async login({ request, response }: HttpContextContract) {
    const username = request.input('username')
    const password = request.input('password')

    try {
      const token = await Keycloak.loginWithPassword(username, password)
      return response.send(token)
    } catch (err) {
      return response.unauthorized({
        errors: [{ message: err.responseText }],
      })
    }
  }

  public async cert({ response }: HttpContextContract) {
    const cert = await Keycloak.getPublicCert()

    return response.send(cert)
  }

  public async register({ request, response }: HttpContextContract) {
    const data = await request.validate(CreateUserValidator)

    const user = await this.authenticationService.createUser(data)

    return response.send({
      message: 'A user has just been created',
      user,
    })
  }

  public async me({ auth, response }: HttpContextContract) {
    const user = auth.use('jwt').payload

    return response.send(user)
  }
}
