// Third party modules includes here:
const axios = require('axios');
const envVars = require('../config/index');

// defint the custom fetch method as an async function
const customFetch = async (methodType = 'get', path, headers, data) => {
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

module.exports = {
    customFetch
};