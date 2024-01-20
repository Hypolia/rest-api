import { type HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import { PodMessagePayload } from '@ioc:Adonis/Core/Cluster'
import Rabbit from '@ioc:Adonis/Addons/Rabbit'
import Logger from '@ioc:Adonis/Core/Logger'

export default class PodsController {
  public async store({ auth, request, response }: HttpContextContract) {
    const data = await request.validate({
      schema: schema.create({
        type: schema.string({ trim: true }),
        namespace: schema.string({ trim: true }),
        name: schema.string({ trim: true }),
        image: schema.string({ trim: true }),
      }),
    })
    const userJwt = auth.use('jwt').payload!

    const payload: PodMessagePayload = {
      ...data,
      user_id: userJwt.sub,
    }

    await Rabbit.sendToQueue('create-pod', payload)

    Logger.info(`User ${userJwt.sub} send message to (create-pod)`)

    return response.send({
      message: 'The message has been sent to the “create-pod” queue',
      payload,
    })
  }
}
