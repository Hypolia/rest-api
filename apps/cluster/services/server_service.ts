import Rabbit from '@ioc:Adonis/Addons/Rabbit'
import { CreateServerValidatorSchema } from '../validators/server_validator'

class ServerService {
  public async createServer(data: CreateServerValidatorSchema) {
    await Rabbit.sendToQueue('create-server', data)
  }
}

export default new ServerService()
