import { type HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CreateServerValidator } from '../validators/server_validator'
import { inject } from '@adonisjs/core/build/standalone'
import ServerService from '../services/server_service'

@inject()
export default class ServersController {
  private serverService = ServerService

  public async store({ request, response }: HttpContextContract) {
    const data = await request.validate(CreateServerValidator)

    await this.serverService.createServer(data)

    return response.send({
      message: 'Message send to queue (create-server)',
    })
  }
}
