const axios = require('axios');
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
        console.log(response);
    } 
    catch (error) {
        console.log(error);
    }
}

module.exports = {
    customFetch
};