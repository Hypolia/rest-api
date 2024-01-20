import { type HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Drive from '@ioc:Adonis/Core/Drive'
import { CreateBundleValidator } from 'App/cluster/validators/bundle_validator'
import { inject } from '@adonisjs/fold'
import BundleService from 'App/cluster/services/bundle_service'

@inject()
export default class BundlesController {
  private bundleService = BundleService

  public async index({ response }: HttpContextContract) {
    const driver = await Drive.use('draco').getFilesWithPrefix('/', 'development')

    console.log(driver)

    return response.send('test')
  }

  public async store({ response, request }: HttpContextContract) {
    const data = await request.validate(CreateBundleValidator)

    await this.bundleService.createBundle(data)

    return response.send({
      message: 'Message send to queue (create-pvc)',
    })
  }
}
