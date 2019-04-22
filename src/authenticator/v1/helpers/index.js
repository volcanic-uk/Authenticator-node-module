// Third party modules includes here:
const axios = require('axios');

// defint the custom fetch method as an async function
const customFetch = async (methodType="get", URL, headers, data) => {
    try{
        let response =  await axios({
            method: methodType,
            url: URL,
            headers:{
                cors:true,
                ...headers
            },
            data:{
                ...data
            }
        });
        return response.data;
    } 
    catch (error) {
        return error;
    }
}

module.exports = {
    customFetch
};