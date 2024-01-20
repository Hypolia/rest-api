import Logger from '@ioc:Adonis/Core/Logger'
import Keycloak, { CreateUserRequest } from '@ioc:Adonis/Auth/Keycloak'

class AuthenticationService {
  public async createUser(data: CreateUserRequest): Promise<void> {
    // const user = await User.create({
    //   ...data,
    //   isAdmin: false,
    //   hasAccessPanel: false,
    // })

    const result = await Keycloak.createUser(data)
    Logger.info(`A user has just been created`)
  }
}

export default new AuthenticationService()
