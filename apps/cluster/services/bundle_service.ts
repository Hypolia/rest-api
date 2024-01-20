import { CreateBundleValidatorSchema } from 'App/cluster/validators/bundle_validator'
import Rabbit from '@ioc:Adonis/Addons/Rabbit'

class BundleService {
  public async createBundle(data: CreateBundleValidatorSchema) {
    await Rabbit.sendToQueue('create-pvc', data)
  }
}

export default new BundleService()
