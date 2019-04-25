/**
 * @function identityLogin to fetch data from the login API by passing the name and the secret
 * the function then will return a token as a string 
 * 
 * @function identityRegister to to register a user using the register identity api by passing identity name 
 * and an authorization token that'll be passed implicitly in the header
 * the response will then return an object containing name, secret, creation date, update date
 * 
 * @function identityValidation to get a validation response from the identity token validation api by passing the token
 * the function then will return an object containing all the info related to the token provided 
 * as an object containing the following: token expiry date, token issue time, token issuer, and the token id
 */


// local dependencies & modules call 
require('dotenv').config(); // environement config file 

const { identityLogin, identityRegister, identityValidation } = require ('../src/authenticator/v1/identity');

module.exports = {
    identityLogin,
    identityRegister,
    identityValidation
};
