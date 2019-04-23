// local dependencies & modules call 
require('dotenv').config();
const identityLogin = require('../src/authenticator/v1/identity').identityLogin; // authenticate login module import

identityLogin('test', '123456789');

module.exports = {
    identityLogin
};
