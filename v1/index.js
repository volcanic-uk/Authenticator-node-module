// local dependencies & modules call 
require('dotenv').config();
const identityLogin = require('../src/authenticator/v1/identity').identityLogin; // authenticate login module import
const identityRegister = require('../src/authenticator/v1/identity').identityRegister; // auth registration module import
const identityValidation = require('../src/authenticator/v1/identity').validateToken; //check token validity

module.exports = {
    identityLogin,
    identityRegister,
    identityValidation
};
