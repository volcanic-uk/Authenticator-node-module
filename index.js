// local dependencies & modules call 
const identityLogin = require('./src/authenticator/v1/identity/index'); // authenticate login module import

// identity login test
identityLogin("post", "http://localhost:3000/api/v1/identity/login", null, {
    "name": "testt",
    "secret": "123456789"
});
