// Third party modules includes here:
const axios = require('axios');
const envVars = require('../authenticator/v1/config');
const envConfigs = require('../../config');

/**
 * 
 * @function customFetch this function is a core function for the node package as it is needed for all the API request functions in the auth server
 * this function is dependiing on Axios and it is a bit modified to suit the current needs of the auth server, it takes 4 main params
 * 
 * @param {string} methodType specify the request type primarily get and post
 * @param {string} path the path of the API needed for the request
 * @param {object} headers the header data needed mainly for authorization purposes to pass a token
 * @param {object} data the data needed when passing a request like the name or password
 */

// define the custom fetch method as an async function
exports.customFetch = async (methodType = 'get', path, headers, data) => {
    try {
        let response = await axios({
            method: methodType,
            url: envVars.env.domain + path,
            headers: {
                ...headers
            },
            data: {
                ...data
            }
        });
        return response.data;
    }
    catch (error) {
        throw error;
    }
};

exports.logInfo = (data) => {
    if (envConfigs.logging.logs === 'true') {
        /* eslint-disable no-console */
        console.log(data);
        /* eslint-enable no-console */
    }
};