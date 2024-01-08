import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import KeycloakService from 'App/authentication/services/keycloak_service'

export default class KeycloakProvider {
  constructor(protected app: ApplicationContract) {}

  public async register() {
    this.app.container.singleton('Adonis/Auth/Keycloak', () => {
      return new KeycloakService(this.app)
    })

    const Auth = this.app.container.resolveBinding('Adonis/Addons/Auth')

    const { JWTGuard } = await import('../guards/jwt-guard')

    Auth.extend('guard', 'jwt', (_auth, _mapping, _config, _provider, ctx) => {
      return new JWTGuard(ctx)
    })
  }

  public async boot() {}

  public async ready() {}

  public async shutdown() {}
}
