const Principal = require('../src/authenticator/v1/principals');
const Identity = require('../src/authenticator/v1/identity');
const Key = require('../src/authenticator/v1/key');
const Token = require('../src/authenticator/v1/token');
const Permission = require('../src/authenticator/v1/permission');
const Config = require('../config');
module.exports = {
    Principal,
    Identity,
    Key,
    Permission,
    Token,
    Config
};