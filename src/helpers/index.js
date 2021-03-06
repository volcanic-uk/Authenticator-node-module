// Third party modules includes here:
const axios = require('axios');
const envConfigs = require('../../config');
const jwt = require('jsonwebtoken');
const { createHash } = require('crypto');

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
exports.customFetch = async (methodType = 'get', path, headers, data = null) => {
    let response = await axios({
        method: methodType,
        url: envConfigs.server.domainName + path,
        headers: {
            ...headers
        },
        data: data
    });
    return response.data;
};

exports.httpClient = axios;

exports.logger = (data) => {
    /* eslint-disable no-console */
    console.log(data);
    /* eslint-enable no-console */
};

exports.JWTDecoder = async (token) => {
    // let decodedResult = decoded.payload.sub.split('/');
    return jwt.decode(token, { complete: true });
    // {
    // stack: decodedResult[2] || null,
    // dataset_id: decodedResult[3] || null,
    // principal: decodedResult[4] || null,
    // identity: decodedResult[5] || null
    // };
};

exports.JWTValidator = async (token, publicKey) => {
    let promise = new Promise((resolve, reject) => {
        jwt.verify(token, publicKey, function (err, decoded) {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
    return promise;
};

exports.md5Generator = (string) => {
    return createHash('md5').update(string).digest('hex');
};