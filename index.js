// local dependencies & modules call 
const identityLogin = require('./src/authenticator/v1/identity/index'); // authenticate login module import
require('dotenv').config();

module.exports = {
    identityLogin
}