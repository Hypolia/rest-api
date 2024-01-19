import User from 'Domains/users/models/user'
import Logger from '@ioc:Adonis/Core/Logger'
import Keycloak from "@ioc:Adonis/Auth/Keycloak";

interface UserCreateDTO {
  email: string
  name: string
  lastname: string
  password: string
}
class AuthenticationService {
  public async createUser(data: UserCreateDTO): Promise<void> {
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
