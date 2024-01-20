

declare module '@ioc:Adonis/Auth/Keycloak' {
  import {
    ProvidersList,
    GuardsList,
    GuardClientContract,
    GuardContract,
  } from '@ioc:Adonis/Addons/Auth'
  import { JwtPayload } from 'jsonwebtoken'

  export type KeycloakConfig = {
    realm: string
    url: string
    admin: {
      clientId: string
      clientSecret: string
    }
  }

  export type CreateUserRequest = {
    username: string
    email: string
    enabled: boolean
    firstName: string
    lastName: string
  }

  export type JWTCustomPayloadData = {
    [key: string]: any
  }

  export interface KeycloakServiceContract {
    getPublicCert(): Promise<string>
    createUser(user: CreateUserRequest): Promise<string | undefined>
    deleteUser(userId: string): Promise<void>
    loginWithPassword(username: string, password: string)
  }

  export interface JWTGuardContract<
    Provider extends keyof ProvidersList,
    Name extends keyof GuardsList,
  > extends GuardContract<Provider, Name> {
    payload?: JWTCustomPayloadData
  }

  export interface JWTClientContract<Provider extends keyof ProvidersList>
    extends GuardClientContract<Provider> {}

  export type JWTGuardConfig<Provider extends keyof ProvidersList> = {
    driver: 'jwt'
    tokenProvider: any
    provider: ProvidersList[Provider]['config']
  }

  const Keycloak: KeycloakServiceContract

  export default Keycloak
}
