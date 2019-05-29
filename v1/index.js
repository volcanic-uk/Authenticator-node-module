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

const { identityLogin, identityRegister, identityValidation, identityLogout } = require('../src/authenticator/v1/identity');
const { createNewPrincipal, deletePrincipal, readPrincipal, updatePrincipal } = require('../src/authenticator/v1/principals');
const { generateToken } = require('../src/authenticator/v1/middlewares/midWithAuth');

const identityRegisterAuth = async (name, password = null, id) => {
    return await identityRegister(name, password, id, await generateToken());
};

const createPrincipalAuth = async (name, dataset_id) => {
    return await createNewPrincipal(name, dataset_id, await generateToken());
};

const deletePrincipalAuth = async (principalId) => {
    return await deletePrincipal(principalId, await generateToken());
};

const readPrincipalAuth = async (principal_id) => {
    return await readPrincipal(principal_id, await generateToken());
};

const updatePrincipalAuth = async (active, principal_id) => {
    return await updatePrincipal(active, principal_id, await generateToken());
};


module.exports = {
    identity: {
        identityLogin,
        identityRegisterAuth,
        identityValidation,
        identityLogout
    },
    principalWithAuth: {
        createPrincipalAuth,
        deletePrincipalAuth,
        readPrincipalAuth,
        updatePrincipalAuth
    },
    principal: {
        createNewPrincipal,
        deletePrincipal,
        readPrincipal,
        updatePrincipal
    }
};
