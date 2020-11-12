
declare namespace AuthV1 {
  type DomainHostString = string;
  type HTTPMethods = "POST" | "GET" | "PATCH" | "DELETE" | "PUT"
  type SortParam = "name"| "created_at"| "updated_at"| "dataset_id"
  export interface LoginParams {
    name: string;
    secret: string;
    datasetId: string;
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

  export interface ILoginToken {
    token: string;
    checksum: string;
  }

  export interface SubjectObject {
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
    withAuth(): this;
    obtainToken(): string;
    internalLogin(): Promise<unknown>;
    fetch(methodType: HTTPMethods): Promise<unknown>
  }

  export interface INewIdentity {
    name: string;
    principal_id: string;
    /**
     * @default null
     */
    secret?: null | string;
    /**
     * @default []
     */
    roles?: string[];
    /**
     * @default []
     */
    privileges?: string[];
    /**
     * @default false
     */
    secretless?: boolean;
    /**
     * @default 'password'
     */
    source?: string;
    /**
     * @default false
     */
    skip_secret_encryption?: boolean
  }

  export interface resetIndentitySecretResponse {
    /**
     * @default "Secret regenerated successfully" if successful
     */
    message: string
  }


  export interface IdentityResponse {
    id: string;
    name: string;
    secret: string;
    source: string;
    secure_id: string;
    dataset_id: string;
    updated_at: string;
    created_at: string;
    last_active_date: null | string;
    last_used_ip_address: null | string;
    active: boolean;
    deleted_at: null | string;
  }

  export interface INewPrincipal {
    name: string;
    dataset_id: string;
    /**
     * @default []
     */
    privileges?: string[];
    /**
     * @default []
     */
    roles?: string[];
  }

  export interface PrincipalResponse {
    id: string;
    status: boolean;
    name: string;
    dataset_id: string;
    secure_id: string;
    updated_at: string;
    created_at: string;
    last_active_date: null | string;
    login_attempts: number;
    active: boolean;
    deleted_at: null | string;
  }

  export interface AuthSearchParams {
    query?: string;
    dataset_id?: string;
    page?: string | number;
    page_size?: string | number;
    /**
     * @default "created_at"
     */
    sort?: SortParam;
    /**
     * @default "asc"
     */
    order?: string;
    name?: string;
    ids?: string
  }
  export interface IPrincipalSearchParams extends AuthSearchParams {}

  export interface IIdentitySearchParams extends AuthSearchParams {
    principal_id?: string
  }

  interface AuthPagination {
    page: number;
    pageSize: number;
    rowCount: number;
    pageCount: number;
  }

  export interface AuthListResponse {
    pagination: AuthPagination;
    data: any
  }

  export interface IlistPrincipalResponse extends AuthListResponse {
    data: PrincipalResponse[]
  }

  export interface IlistIdentityResponse extends AuthListResponse {
    data: IdentityResponse[]
  }

}

declare const AuthModule: {
  Identity: Identity
  Token: Token
  Principal: Principal
  Config: AuthV1.Config
  Key: Key
  Permission: Permission
  Subject: Subject
  Service: Service
  Group: Group
  Roles: Roles
  Privilege: Privilege
  Authorization: Authorization
  AuthenticationMiddleware: AuthenticationMiddleware
  AuthorizationMiddleware: AuthorizationMiddleware
}

export default AuthModule
export class Identity extends AuthV1.V1Base {
  login(opts: AuthV1.LoginParams): Promise<AuthV1.ILoginToken>;
  create(identity: AuthV1.INewIdentity): Promise<AuthV1.IdentityResponse>
  resetSecret(input: { secret: null | string, id: string }): Promise<AuthV1.resetIndentitySecretResponse>
  getIdentities(searchParams: AuthV1.IIdentitySearchParams): Promise<AuthV1.IlistIdentityResponse>
  deactivateIdentity(secure_id: string): Promise<{ result: string }>
  activateIdentity(secure_id: string): Promise<{ message: string }>
}
export class Token extends AuthV1.V1Base {
  validate(token: string): Promise<boolean>
  isSingleUser(token: string): Promise<boolean>
  remoteValidation(): Promise<boolean>
  parseSubject(): AuthV1.SubjectObject | null
}

export const Config: AuthV1.Config

export class Principal extends AuthV1.V1Base {
  create(principal: AuthV1.INewPrincipal): Promise<AuthV1.PrincipalResponse>
  getByID(id: string): Promise<AuthV1.PrincipalResponse>
  getPrincipals(searchParams: AuthV1.IPrincipalSearchParams): Promise<AuthV1.IlistPrincipalResponse>
}
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