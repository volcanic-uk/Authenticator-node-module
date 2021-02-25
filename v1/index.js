const Principal = require('../src/authenticator/v1/principals');
const Identity = require('../src/authenticator/v1/identity');
const Key = require('../src/authenticator/v1/key');
const Token = require('../src/authenticator/v1/token');
const Service = require('../src/authenticator/v1/service');
const Permission = require('../src/authenticator/v1/permission');
const Subject = require('../src/authenticator/v1/subject');
const Config = require('../config');
const Group = require('../src/authenticator/v1/groups');
const Roles = require('../src/authenticator/v1/roles');
const Privilege = require('../src/authenticator/v1/privileges');
const Authorization = require('../src/authenticator/v1/authorization');
const AuthenticationMiddleware = require('../src/authenticator/v1/middleware/authentication');
const AuthorizationMiddleware = require('../src/authenticator/v1/middleware/authorization');
const VRN = require('../src/authenticator/v1/vrn');
const AuthV1Error = require('../src/authenticator/v1/errors');
module.exports = {
    Principal,
    Identity,
    Key,
    Permission,
    Subject,
    Token,
    Config,
    Service,
    Group,
    Roles,
    Privilege,
    Authorization,
    AuthenticationMiddleware,
    AuthorizationMiddleware,
    VRN,
    AuthV1Error
};
