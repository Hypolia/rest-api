import Keycloak, { JWTCustomPayloadData, JWTGuardContract } from '@ioc:Adonis/Auth/Keycloak'
import { type HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import JwtAuthenticationException from '../exceptions/jwt-authentication-exception'
import jwt from 'jsonwebtoken'

export class JWTGuard implements JWTGuardContract<any, any> {
  public name: any
  public config: any
  public user?: any
  public isLoggedOut: boolean
  public isGuest: boolean
  public isLoggedIn: boolean
  public provider: any
  public payload?: JWTCustomPayloadData

  constructor(private ctx: HttpContextContract) {}

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
  public isAuthenticated = true
  public authenticationAttempted = false

  public async check(): Promise<boolean> {
    try {
      await this.authenticate()
    } catch (error) {}

    return this.isAuthenticated
  }

  public async authenticate(): Promise<any> {
    if (this.authenticationAttempted) {
      return this.user
    }

    //this.authenticationAttempted = true

    const token = this.getBearerToken()
    const paylaod = await this.verifyToken(token)

    this.payload = paylaod as any
  }

  private async verifyToken(token: string) {
    const key = await Keycloak.getPublicCert()
    const publicKey = `-----BEGIN CERTIFICATE-----\n${key}\n-----END CERTIFICATE-----`

    const decodedToken = jwt.decode(token, { complete: true })

    const algorithm = decodedToken?.header.alg as jwt.Algorithm

    const verifiedToken = jwt.verify(token, publicKey, { algorithms: [algorithm] })
    return verifiedToken
  }

  private getBearerToken(): string {
    const token = this.ctx.request.header('Authorization')
    if (!token) {
      throw new JwtAuthenticationException('No Authorization header passed')
    }

    const [type, value] = token.split(' ')
    if (!type || type.toLowerCase() !== 'bearer' || !value) {
      throw new JwtAuthenticationException('Invalid Authorization header value: ' + token)
    }

    return value
  }
}
