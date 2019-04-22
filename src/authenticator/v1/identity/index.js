// require the custom api fetch from the helpers module folder
const fetchAPI = require('../helpers/index');

//define the fetch API function as an asynchronous one and waiting for the fetch api method to process the response
const fetchLoginApi = async (method, URL, headers=null, data=null) => {
    let result = await fetchAPI.customFetch(method, URL, headers, data);
}

module.exports = {
    fetchLoginApi
}
