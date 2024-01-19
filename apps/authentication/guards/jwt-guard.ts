import Keycloak, { JWTCustomPayloadData, JWTGuardConfig, JWTGuardContract } from "@ioc:Adonis/Auth/Keycloak";
import { type HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import jwt from 'jsonwebtoken'
import { AuthenticationException } from '@adonisjs/auth/build/standalone'
import { BaseGuard } from '@adonisjs/auth/build/src/Guards/Base'
import { EmitterContract } from '@ioc:Adonis/Core/Event'

export class JWTGuard extends BaseGuard<any> implements JWTGuardContract<any, any> {
  public name: any
  public user?: any
  public isLoggedOut: boolean
  public provider: any
  public payload?: JWTCustomPayloadData

  constructor(
    _name: string,
    public config: JWTGuardConfig<any>,
    private emitter: EmitterContract,
    provider: any,
    private ctx: HttpContextContract,

  ) {
    super('jwt', config, provider)
  }

  public verifyCredentials(uid: string, password: string): Promise<any> {
    console.log(uid, password)
    throw new Error('Method not implemented.')
  }

  public attempt(uid: string, password: string, ...args: any[]): Promise<any> {
    console.log(uid, password, args)
    throw new Error('Method not implemented.')
  }

  public login(user: any, ...args: any[]): Promise<any> {
    console.log(user, args)
    throw new Error('Method not implemented.')
  }

  public loginViaId(id: string | number, ...args: any[]): Promise<any> {
    console.log(id, args)
    throw new Error('Method not implemented.')
  }
  public logout(...args: any[]): Promise<void> {
    console.log(args)
    throw new Error('Method not implemented.')
  }

  public toJSON() {
    throw new Error('Method not implemented.')
  }
  public isAuthenticated = false
  public authenticationAttempted = false

  public async check(): Promise<boolean> {
    try {
      await this.authenticate()
    } catch (error) {
      if (!(error instanceof AuthenticationException)) {
        throw error
      }

      this.ctx.logger.trace(error, 'Authentication failure')
    }

    return this.isAuthenticated
  }

  public async authenticate(): Promise<any> {
    const token = this.getBearerToken()
    const payload = await this.verifyToken(token)
    this.markUserAsLoggedIn(payload, true)
    await this.emitter.emit('adonis:jwt:authenticate', {
      name: this.name,
      ctx: this.ctx,
      user: payload,
      token,
    })
    this.payload = payload as any
  }

  private async verifyToken(token: string) {
    try {
      const key = await Keycloak.getPublicCert()
      const publicKey = `-----BEGIN CERTIFICATE-----\n${key}\n-----END CERTIFICATE-----`

      const decodedToken = jwt.decode(token, { complete: true })

      const algorithm = decodedToken?.header.alg as jwt.Algorithm

      const verifiedToken = jwt.verify(token, publicKey, { algorithms: [algorithm] })
      return verifiedToken
    } catch (e) {
      throw AuthenticationException.invalidToken(this.name)
    }
  }

  private getBearerToken(): string {
    const token = this.ctx.request.header('Authorization')

    if (!token) {
      throw AuthenticationException.invalidToken(this.name)
    }
    const [type, value] = token.split(' ')
    if (!type || type.toLowerCase() !== 'bearer' || !value) {
      throw AuthenticationException.invalidToken(this.name)
    }

    return value
  }
}
