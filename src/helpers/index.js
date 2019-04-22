// Third party modules includes here:
const axios = require('axios');

// defint the custom fetch method as an async function
const customFetch = async (methodType="get", path, headers, data) => {
    try{
        let response =  await axios({
            method: methodType,
            url: process.env.AUTH_DOMAIN+path,
            headers:{
                ...headers
            },
            data:{
                ...data
            }
        });
        return response.data;
    } 
    catch (error) {
        throw error;
    }
}

module.exports = {
    customFetch
};