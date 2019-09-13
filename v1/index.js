const Principal = require('../src/authenticator/v1/principals');
const Identity = require('../src/authenticator/v1/identity');
const Key = require('../src/authenticator/v1/key');
const Token = require('../src/authenticator/v1/token');
const Service = require('../src/authenticator/v1/service');
const Config = require('../config');
const Group = require('../src/authenticator/v1/groups');
const Roles = require('../src/authenticator/v1/roles');
const Privilege = require('../src/authenticator/v1/privileges');
module.exports = {
    Principal,
    Identity,
    Key,
    Token,
    Config,
    Service,
    Group,
    Roles,
    Privilege
};