declare module 'passport-bitbucket-oauth20' {
  import { Strategy as OAuth2Strategy } from 'passport-oauth2'

  export interface Profile {
    provider: string
    id: string
    username: string
    displayName: string
    emails: Array<{ value: string }>
    photos: Array<{ value: string }>
    _json: any
  }

  export interface StrategyOptions {
    clientID: string
    clientSecret: string
    callbackURL: string
  }

  export type VerifyFunction = (
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any) => void
  ) => void

  export class Strategy extends OAuth2Strategy {
    constructor(options: StrategyOptions, verify: VerifyFunction)
  }
}
