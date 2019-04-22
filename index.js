// local dependencies & modules call 
const ApiFetchHelper = require('./src/authenticator/v1/identity/index'); // login api fucntion based on helper fetch API

ApiFetchHelper.fetchLoginApi("post", "http://localhost:3000/api/v1/identity/login", null, {
    "name": "testt",
    "secret": "123456789"
});