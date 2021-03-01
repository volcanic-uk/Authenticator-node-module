import { Request, Response, NextFunction } from 'express';

export declare namespace AuthV1 {
  type DomainHostString = string
  type HTTPMethods = "POST" | "GET" | "PATCH" | "DELETE" | "PUT"
  type SortParam = "name" | "created_at" | "updated_at" | "dataset_id"

  export interface LoginParams {
    name: string
    secret: string
    datasetId: string
    audience?: string[]
  }

  export interface AuthDetails {
    identity_name: string
    secret: string
    dataset_id: string | number
    audience?: string[]
  }

  export interface AuthConnection {
    domainName: DomainHostString
    stack_id: string
  }

  export interface ILoginToken {
    token: string
    checksum: string
  }

  export interface SubjectObject {
    actor: string
    stack_id: string
    dataset_id: string
    principal_id: string
    identity_id: string
  }

  interface authConfig extends AuthDetails {
    set(authConfig: AuthDetails): void
    get(): AuthDetails
  }

  interface cacheConfig {
    enableCaching: boolean
    set(config: { enableCaching: boolean }): void
    get(): { enableCaching: boolean }
  }

  interface serverConfig extends AuthConnection {
    set(config: AuthConnection): void
    get(): AuthConnection
  }

  export type Config = {
    auth: authConfig
    cache: cacheConfig
    server: serverConfig
  }

  export abstract class V1Base {
    internalAuth: boolean
    baseURL: string
    token: null | string
    loginAttempts: number
    requestID: null | string
    errorMessage: null | any
    errorCode: null | string
    withAuth(): this
    obtainToken(): string
    internalLogin(): Promise<unknown>
    fetch(methodType: HTTPMethods): Promise<unknown>
  }

  export interface INewIdentity {
    name: string
    principal_id?: string
    /**
     * @default null
     */
    secret?: null | string
    /**
     * @default []
     */
    roles?: string[]
    /**
     * @default []
     */
    privileges?: string[]
    /**
     * @default []
     */
    secretless?: boolean
    /**
     * @default 'password'
     */
    source?: string
    /**
     * @default false
     */
    skip_secret_encryption?: boolean
  }

  export interface IUpdateIdentity {
    name?: string
    /**
     * @default null
     */
    id?: string
    /**
     * @default null
     */
    roles?: string[]
    /**
     * @default []
     */
    privileges?: string[]
    /**
     * @default []
     */
  }

  export interface resetIdentitySecretResponse {
    /**
     * @default "Secret regenerated successfully" if successful
     */
    message: string
  }

  export interface IdentityResponse {
    id: string
    name: string
    secret: string
    source: string
    secure_id: string
    dataset_id: string
    updated_at: string
    created_at: string
    last_active_date: null | string
    last_used_ip_address: null | string
    active: boolean
    deleted_at: null | string
  }

  export interface IUpdatePrivileges {
    id: string
    privileges?: string[]
    /**
     * @default []
     */
  }

  export interface IUpdateRoles {
    id: string
    roles?: string[]
    /**
     * @default []
     */
  }

  export interface IGenerateToken {
    id: string
    audience?: string[]
    /**
     * @default []
     */
    expiry_date?: number | string | Date
    /**
     * @default null
     */
    single_use?: boolean
    /**
     * @default false
     */
    nbf?: Date
    /**
     * @default null
     */
  }

  export interface INewPrincipal {
    name: string
    dataset_id?: string | number
    /**
     * @default null
     */
    privileges?: string[]
    /**
     * @default []
     */
    roles?: string[]
  }

  export interface IUpdatePrincipal extends INewPrincipal {
    id: string
  }

  export interface AuthSearchParams {
    query?: any
    dataset_id?: string
    page?: string | number
    page_size?: string | number
    /**
     * @default "created_at"
     */
    sort?: SortParam
    /**
     * @default "asc"
     */
    order?: string
    name?: string
    ids?: string
  }

  export interface IPrincipalSearchParams extends AuthSearchParams { }

  export interface IPermissionSearchParams extends AuthSearchParams { }

  export interface IServiceSearchParams extends AuthSearchParams { }

  export interface IGroupsSearchParams extends AuthSearchParams { }

  export interface IRolesSearchParams extends AuthSearchParams { }

  export interface IPrivilegesSearchParams extends AuthSearchParams {
    scope?: string
    /**
     * @default ""
     */
    group_id?: number
    /**
     * @default ""
     */
    permission_id?: string
    /**
     * @default ""
     */
    tag?: string
    /**
     * @default ""
     */
    allow?: boolean
    /**
     * @default true
     */
  }

  export interface IIdentitySearchParams extends AuthSearchParams {
    principal_id?: string
  }

  interface AuthPagination {
    page: number
    pageSize: number
    rowCount: number
    pageCount: number
  }

  export interface AuthListResponse {
    pagination: AuthPagination
    data: any
  }

  export interface IlistPrincipalResponse extends AuthListResponse {
    data: PrincipalResponse[]
  }

  export interface IlistIdentityResponse extends AuthListResponse {
    data: IdentityResponse[]
  }

  export interface IPrivilegesBySubjectSearchParams {
    subject?: string
    /**
     * @default ''
     */
    serviceName?: string
    /**
     * @default ''
     */
    permissionName?: string
    /**
     * @default ''
     */
  }

  export interface IAuthorizeObject {
    serviceName: string
    permissionName: string
    resourceType: string
    resourceID: string
    datasetID: string | number
  }

  export interface IScope {
    allow: boolean;
    stack?: string | null;
    dataset_id?: string | null;
    resourceType?: string | null;
    resourceID?: string | null
  }
  export interface INewPermission {
    name: string
    description?: string
    /**
     * @default ""
     */
    service_id: string
  }

  export interface IUpdatePermission extends INewPermission {
    id: string
  }

  export interface INewGroup {
    name?: string
    /**
     * @default null
     */
    permissions?: string[]
    /**
     * @default []
     */
    description?: string
    /**
     * @default '
     */
  }

  export interface IUpdateGroup extends INewGroup {
    id: string
  }

  export interface INewPrivilege {
    scope: string
    permission_id?: string | null
    /**
     * @default null
     */
    group_id?: number | null
    /**
     * @default null
     */
    description?: string | null
    /**
     * @default null
     */
    allow?: boolean
    /**
     * @default true
     */
    tag?: string | null
    /**
     * @default null
     */
  }
  export interface IUpdatePrivilege extends INewPrivilege {
    id: string
  }

  export interface INewRole {
    name: string
    privileges?: number[]
    /**
     * @default []
     */
    parent_id?: string
    /**
     * @default null
     */
  }
  export interface IUpdateRole extends INewRole {
    id: string
  }
  export interface PrincipalResponse {
    id: string
    status: boolean
    name: string
    dataset_id: string
    secure_id: string
    updated_at: string
    created_at: string
    last_active_date: null | string
    login_attempts: number
    active: boolean
    data:{
      length:number
    }
    deleted_at: null | string
  }
  export interface ServiceResponse {
    id: string
    name: string
    data:{
      length:number
    }
    updated_at: string
    created_at: string
    active: boolean
  }
  export interface PermissionResponse {
    id: string
    name: string
    data:{
      length:number
    }
    description: string
    service_id: number
    updated_at: string
    created_at: string
    active: boolean
  }
  export interface GroupResponse {
    id: number
    name: string
    data:{
      length:number
    }
    description: string
    updated_at: string
    created_at: string
    active: boolean
  }
  export interface RoleResponse {
    id: string
    name: string
    data:{
      length:number
    }
    updated_at: string
    created_at: string
    parent_id: number
  }
  export interface PrivilegeResponse {
    id: number
    scope: string
    data:{
      length:number
    }
    permission_id?: number
    group_id?: number
    allow: boolean
    updated_at: string
    created_at: string
    tag: string
  }
  export interface KeyResponse {
    id: number
    data:{
      length:number
    }
    public_key: string
    updated_at: string
    created_at: string
    overridden_at: string
    deleted_at: string
  }
}

export interface IAuthorizationMiddleware {
  (serviceName: string): (req: Request, res: Response, next: NextFunction) => Promise<void>
}

export interface IAuthenticationMiddleware {
  (req: Request, res: Response, next: NextFunction): Promise<void>
}

export interface AuthRequest extends Request {
  authorize?: (obj: { permissionName: string, resourceType: string, resourceID: string }) => Promise<void>
  custom?: {
    tokenData: {
      sub?: string
      exp?: number,
      nbf?: number,
      aud?: string[],
      iat?: number,
      iss?: string
    };
    parsedSubject: {
      actor: string,
      stack_id: string,
      dataset_id: string,
      principal_id: string,
      identity_id: string
    } | null;
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
  AuthV1Error: AuthV1Error
  AuthenticationMiddleware: IAuthenticationMiddleware
  AuthorizationMiddleware: IAuthorizationMiddleware
};

export default AuthModule
export class Identity extends AuthV1.V1Base {
  login(name: string, secret: string, audience: string[], datasetId: string): Promise<AuthV1.ILoginToken>
  create(identity: AuthV1.INewIdentity): Promise<AuthV1.IdentityResponse>
  update(identity: AuthV1.IUpdateIdentity): Promise<AuthV1.IdentityResponse>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF updatePrivileges`
  updatePrivileges(
      privileges: AuthV1.IUpdatePrivileges
  ): Promise<AuthV1.IdentityResponse>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF updateRoles`
  updateRoles(roles: AuthV1.IUpdateRoles): Promise<AuthV1.IdentityResponse>
  resetSecret(input: {
    secret: null | string
    id: string
  }): Promise<AuthV1.resetIdentitySecretResponse>
  getIdentities(
      searchParams: AuthV1.IIdentitySearchParams
  ): Promise<AuthV1.IlistIdentityResponse>
  deactivateIdentity(secure_id: string): Promise<{ message: string; status: boolean }>
  activateIdentity(secure_id: string): Promise<{ message: string; status: boolean }>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF getByID`
  getByID(secure_id: string): Promise<{ message: string }>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF delete`
  delete(secure_id: string): Promise<{ message: string }>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF logout`
  /**
   * @note logout an active user. This function depends on the attached Authorization header
   * If you'd like to logout an existing user but not your service access you should use the
   * Identity instance method setToken and provide the user's access token
   */
  logout(): Promise<null>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF generateToken`
  generateToken(input: AuthV1.IGenerateToken): Promise<{ token: string; checksum: string }>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF getIdentityById`
  getIdentityById(id: string): Promise<AuthV1.IdentityResponse>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF getRoles`
  getRoles(id: string): Promise<AuthV1.IdentityResponse>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF getPrivileges`
  getPrivileges(id: string): Promise<AuthV1.IdentityResponse>
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
  getPrincipals(
      searchParams: AuthV1.IPrincipalSearchParams
  ): Promise<AuthV1.IlistPrincipalResponse>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF update`
  update(principal: AuthV1.IUpdatePrincipal): Promise<AuthV1.PrincipalResponse>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF delete`
  delete(id: string): Promise<AuthV1.PrincipalResponse>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF updatePrivileges`
  updatePrivileges(
      privileges: AuthV1.IUpdatePrivileges
  ): Promise<AuthV1.PrincipalResponse>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF updatePrivileges`
  updateRoles(roles: AuthV1.IUpdateRoles): Promise<AuthV1.IdentityResponse>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF deactivatePrincipal`
  deactivatePrincipal(id: string): Promise<{ result: string }>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF activatePrincipal`
  activatePrincipal(id: string): Promise<{ result: string }>
  getIdentities(
      searchParams: AuthV1.IIdentitySearchParams
  ): Promise<AuthV1.IlistIdentityResponse>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF getRoles`
  getRoles(id: string): Promise<AuthV1.IdentityResponse>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF getPrivileges`
  getPrivileges(id: string): Promise<AuthV1.IdentityResponse>
}

export class Key extends AuthV1.V1Base {
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF getByID`
  getByID(id: string, expired?: boolean): Promise<AuthV1.KeyResponse>
}

export class Permission extends AuthV1.V1Base {
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF create`
  create(permission: AuthV1.INewPermission): Promise<AuthV1.PermissionResponse>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF getByID`
  getByID(id: string): Promise<AuthV1.PermissionResponse>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF getPermissions`
  getPermissions(
      searchParams: AuthV1.IPermissionSearchParams
  ): Promise<AuthV1.PermissionResponse>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF update`
  update(
      permission: AuthV1.IUpdatePermission
  ): Promise<AuthV1.PermissionResponse>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF delete`
  delete(id: string): Promise<AuthV1.PermissionResponse>
}


export class Subject extends AuthV1.V1Base {
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF getPrivilegesBySubject`
  getPrivilegesBySubject(
      searchParams: AuthV1.IPrivilegesBySubjectSearchParams
  ): Promise<AuthV1.IlistIdentityResponse>
}

export class Service extends AuthV1.V1Base {
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF create`
  create(name: string): Promise<AuthV1.ServiceResponse>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF getByID`
  getByID(id: string): Promise<AuthV1.ServiceResponse>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF getByName`
  getByName(name: string): Promise<AuthV1.ServiceResponse>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF getServices`
  getServices(
      searchParams: AuthV1.IServiceSearchParams
  ): Promise<AuthV1.ServiceResponse>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF update`
  update(id: "string", name: "string"): Promise<AuthV1.ServiceResponse>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF delete`
  delete(id: "string"): Promise<AuthV1.ServiceResponse>
}

export class Group extends AuthV1.V1Base {
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF create`
  create(group: AuthV1.INewGroup): Promise<AuthV1.GroupResponse>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF getById`
  getById(id: string): Promise<AuthV1.GroupResponse>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF getByName`
  getByName(name: string): Promise<AuthV1.GroupResponse>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF getGroups`
  getGroups(
      searchParams: AuthV1.IGroupsSearchParams
  ): Promise<AuthV1.GroupResponse>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF update`
  update(searchParams: AuthV1.IUpdateGroup): Promise<AuthV1.GroupResponse>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF delete`
  delete(id: string): Promise<AuthV1.GroupResponse>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF attachPermissions`
  attachPermissions(
      id: "string",
      permission_ids: string[]
  ): Promise<AuthV1.GroupResponse>
}

export class Roles extends AuthV1.V1Base {
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF create`
  create(group: AuthV1.INewRole): Promise<AuthV1.RoleResponse>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF getById`
  getById(id: string): Promise<AuthV1.RoleResponse>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF getRoles`
  getRoles(
      searchParams: AuthV1.IRolesSearchParams
  ): Promise<AuthV1.RoleResponse>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF update`
  update(role: AuthV1.IUpdateRole): Promise<AuthV1.RoleResponse>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF delete`
  delete(secure_id: string): Promise<{ message: string }>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF attachPermissions`
  attachPrivileges(
      id: "string",
      privilege_ids: string[]
  ): Promise<AuthV1.RoleResponse>
}

export class Privilege extends AuthV1.V1Base {
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF create`
  create(privilege: AuthV1.INewPrivilege): Promise<AuthV1.PrivilegeResponse>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF getById`
  getById(id: string): Promise<AuthV1.PrivilegeResponse>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF getByServicePermissions`
  getByServicePermissions(
      serviceName: string,
      permissionName: string
  ): Promise<AuthV1.PrivilegeResponse>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF getByToken`
  getByToken(): Promise<AuthV1.PrivilegeResponse>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF getByToken`
  getPrivileges(
      searchParams: AuthV1.IPrivilegesSearchParams
  ): Promise<AuthV1.PrivilegeResponse>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF getByToken`
  update(privilege:AuthV1.IUpdatePrivilege): Promise<AuthV1.PrivilegeResponse>
  // TODO: `FIGURE OUT WHAT IS THE RETURN TYPE OF delete`
  delete(id: string): Promise<{ message: string }>
}

export class Authorization extends AuthV1.V1Base {
  authorize(input: AuthV1.IAuthorizeObject): Promise<AuthV1.IScope>
}

export class AuthV1Error extends Error {
  statusCode: number;
  requestID: string;
  errorCode: number;
  message: string;
  dataError: string;
  status: string;
  getMessage(): string;
}
