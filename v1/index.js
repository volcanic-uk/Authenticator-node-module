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
 * 
 * @function identityLogout to black list a token by passing the token as a string parameter 
 * the function then will return a success or a fail message depending on the token whether it is valid,
 * blacklisted already, or invalid
 */


// local dependencies & modules call 
require('dotenv').config(); // environement config file 

const { identityLogin, identityRegister, identityValidation, identityLogout } = require('../src/authenticator/v1/identity');

identityLogout('eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTcwNDE0MTgsImlhdCI6MTU1NjE3NzQxOCwiaXNzIjoiVm9sY2FuaWMgYmV0dGVyIHBlb3BsZSB0ZWNobm9sb2d5IiwianRpIjoiZjllOGY3YzAtNjcyYi0xMWU5LTk3MzAtMWQ5Mzc3OWJlODBjIn0.ANxP2nDOVw1AdJ_QjTiDbrcIE_mc2OnIqGEKjUbD9EX4tV4nmGsyoMrKLBpzC0-j8O3dT-nTIURIULfUuvzG9JZxAG_f_Bb-M5hzL_2vD3hUvayLxm-tjaC-_SomTSIPIldc3dblM_DkIFtNSzJ6hArgosg5MAORmGvyIeAnFdRRmIAx');

module.exports = {
    identityLogin,
    identityRegister,
    identityValidation,
    identityLogout
};
