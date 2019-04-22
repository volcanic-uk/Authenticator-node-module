// require the custom api fetch from the helpers module folder
const fetch = require('../helpers/index');

//define the fetch API function as an asynchronous one and waiting for the fetch api method to process the response
module.exports = identityLogin = async (method, URL, headers=null, data=null) => {
    let result = await fetch.customFetch(method, URL, headers, data);
}
