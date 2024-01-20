import {
  CreateUserRequest,
  KeycloakConfig,
  KeycloakServiceContract,
} from '@ioc:Adonis/Auth/Keycloak'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { AuthenticationException } from '@adonisjs/auth/build/standalone'
import axios from 'axios'
import Logger from '@ioc:Adonis/Core/Logger'

type WellKnownKeyResponse = {
  keys: {
    'kid': string
    'kty': string
    'alg': string
    'use': string
    'n': string
    'e': string
    'x5c': string[]
    'x5t': string
    'x5t#S256': string
  }[]
}

type GetAdminTokenResponse = {
  'access_token': string
  'expires_in': number
  'refresh_expires_in': number
  'not-before-policy': number
  'token_type': string
  'scope': string
}

export default class KeycloakService implements KeycloakServiceContract {
  private readonly config: KeycloakConfig
  private publicCert: string

  constructor(private readonly app: ApplicationContract) {
    this.config = this.app.container
      .resolveBinding('Adonis/Core/Config')
      .get('keycloak.keycloakConfig')

    if (!this.config) {
      throw new Error('Keycloak config is not defined')
    }
  }

  public async getPublicCert() {
    return this.publicCert ?? (await this.fetchOidcCert())
  }

  private async fetchOidcCert(): Promise<string> {
    const url = `${this.config.url}/realms/${this.config.realm}/protocol/openid-connect/certs`
    const { data } = await axios.get<WellKnownKeyResponse>(url)
    const rs256Key = data.keys.filter((key) => key.alg === 'RS256')

    if (!rs256Key.length) {
      throw new Error('RS256 key not found')
    }

    this.publicCert = rs256Key[0].x5c[0]

    return this.publicCert
  }

  public async createUser(user: CreateUserRequest): Promise<string | undefined> {
    const url = `${this.config.url}/admin/realms/${this.config.realm}/users`
    try {
      const token = await this.getAdminToken()

      const response = await axios.post(url, user, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const locationHeader = response.headers['location']

      return locationHeader.split('/').pop()
    } catch (err) {
      console.log(err)
      return
    }
  }

  private async getAdminToken(): Promise<string> {
    const url = `${this.config.url}/realms/${this.config.realm}/protocol/openid-connect/token`

    const data = {
      grant_type: 'client_credentials',
      client_id: this.config.admin.clientId,
      client_secret: this.config.admin.clientSecret,
    }

    const response = await axios.post<GetAdminTokenResponse>(url, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    return response.data.access_token
  }

  public async deleteUser(userId: string): Promise<void> {
    const url = `${this.config.url}/admin/realms/${this.config.realm}/users/${userId}`

    const tokenResponse = await this.getAdminToken()

    const response = await axios.delete(url, {
      headers: {
        'Authorization': `Bearer ${tokenResponse}`,
        'Content-Type': 'application/json',
      },
    })

    if (response.status !== 204) {
      throw new Error('Failed to delete user')
    }
  }

  public async loginWithPassword(username: string, password: string) {
    Logger.info(`User login test: ${username} : ${password}`)

    try {
      const resp = await axios.post(
        `${this.config.url}/realms/${this.config.realm}/protocol/openid-connect/token`,
        {
          grant_type: 'password',
          client_id: this.config.admin.clientId,
          client_secret: this.config.admin.clientSecret,
          password: password,
          username: username,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          withCredentials: true,
          method: 'POST',
        }
      )

      return resp.data
    } catch (err) {
      throw new AuthenticationException('Invalid credentials', 'E_INVALID_CREDENTIALS')
    }
  }
}
