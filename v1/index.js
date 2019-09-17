const Principal = require('../src/authenticator/v1/principals'),
    Identity = require('../src/authenticator/v1/identity'),
    Key = require('../src/authenticator/v1/key'),
    Token = require('../src/authenticator/v1/token'),
    Service = require('../src/authenticator/v1/service'),
    Config = require('../config'),
    Group = require('../src/authenticator/v1/groups'),
    Roles = require('../src/authenticator/v1/roles'),
    Privilege = require('../src/authenticator/v1/privileges'),
    Permission = require('../src/authenticator/v1/permissions');
module.exports = {
    Principal,
    Identity,
    Key,
    Token,
    Config,
    Service,
    Group,
    Roles,
    Privilege,
    Permission
};