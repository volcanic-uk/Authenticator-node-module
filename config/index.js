require('dotenv').config(); // environement config file 


module.exports = {
    server: {
        domainName: process.env.AUTH_DOMAIN,
    },
    cache: {
        moduleTokenDuration: process.env.MODULE_TOKEN_DURATION,
        thirdPartyTokenDuration: process.env.THIRD_PARTY_TOKEN_DURATION,
    },
    auth: {
        authIdentity: process.env.IDENTITY,
        authSecret: process.env.SECRET
    },
    logging: {
        logs: process.env.ENABLE_LOGGING
    }
};