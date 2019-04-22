// require the custom api fetch from the helpers module folder
const fetch = require('../../../helpers/index');
const routes = require('./routes')

//define the fetch API function as an asynchronous one and waiting for the fetch api method to process the response
exports.identityLogin = async (identityName, identitySecret) => {
    try {
        let credentials = {
            name: identityName,
            secret: identitySecret
        }

        let result = await fetch.customFetch(routes.login.method, routes.login.path, null, credentials);
        result.token;
    } 
    
    catch (error){
        throw error;
    }
}
 