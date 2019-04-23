// require the custom api fetch from the helpers module folder
const fetch = require('../../../helpers/index');
const routes = require('../../../config/index');

//define the fetch API function as an asynchronous one and waiting for the fetch api method to process the response
exports.identityLogin = async (identityName, identitySecret) => {
    try {
        let credentials = {
            name: identityName,
            secret: identitySecret
        };

        let result = await fetch.customFetch(routes.login.method, routes.login.path, null, credentials);
        return result.token;
    } catch (error) {
        throw error.response.data.reason.message;
    }
};
