import Env from '@ioc:Adonis/Core/Env'
import { KeycloakConfig } from '@ioc:Adonis/Auth/Keycloak'

export const keycloakConfig: KeycloakConfig = {
  realm: Env.get('KC_REALM'),
  url: Env.get('KC_URL'),
  admin: {
    clientId: Env.get('KC_CLIENT_ID'),
    clientSecret: Env.get('KC_CLIENT_SECRET'),
  },
}
