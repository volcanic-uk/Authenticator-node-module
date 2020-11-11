
declare namespace AuthV1 {
  type DomainHostString = string;

  export type LoginParams = {
    name: string;
    secret: string;
    datasetId: string | number;
    audience?: string[];
  }

  export interface AuthDetails {
    identity_name: string;
    secret: string;
    dataset_id: string | number;
    audience?: string[];
  }

  export interface AuthConnection {
    domainName: DomainHostString;
    stack_id: string;
  }

  export type ILoginToken = {
    token: string;
    checksum: string;
  }

  export type SubjectObject = {
    actor: string;
    stack_id: string;
    dataset_id: string;
    principal_id: string;
    identity_id: string;
  }

  interface authConfig extends AuthDetails {
    set(authConfig: AuthDetails): void;
    get(): AuthDetails;
  }

  interface cacheConfig {
    enableCaching: boolean;
    set(config: { enableCaching: boolean }): void;
    get(): { enableCaching: boolean }
  }


  interface serverConfig extends AuthConnection {
    set(config: AuthConnection): void;
    get(): AuthConnection;

  }
  export type Config = {
    auth: authConfig;
    cache: cacheConfig;
    server: serverConfig
  }

  export abstract class V1Base {
    internalAuth: boolean;
    baseURL: string;
    token: null | string;
    loginAttempts: number;
    requestID: null | string;
    errorMessage: null | any;
    errorCode: null | string;
  }
}

declare module "@volcanic-uk/auth-module/v1" {
  export class Identity extends AuthV1.V1Base {
    login(opts: AuthV1.LoginParams): Promise<AuthV1.ILoginToken>;
  }
  export class Token extends AuthV1.V1Base {
    validate(token: string): Promise<boolean>
    isSingleUser(token: string): Promise<boolean>
    remoteValidation(): Promise<boolean>
    parseSubject(): AuthV1.SubjectObject | null
  }

  export const Config: AuthV1.Config

  export class Principal extends AuthV1.V1Base { }
  export class Key extends AuthV1.V1Base { }
  export class Permission extends AuthV1.V1Base { }
  export class Subject extends AuthV1.V1Base { }
  export class Service extends AuthV1.V1Base { }
  export class Group extends AuthV1.V1Base { }
  export class Roles extends AuthV1.V1Base { }
  export class Privilege extends AuthV1.V1Base { }
  export class Authorization extends AuthV1.V1Base { }
  export class AuthenticationMiddleware extends AuthV1.V1Base { }
  export class AuthorizationMiddleware extends AuthV1.V1Base { }
}