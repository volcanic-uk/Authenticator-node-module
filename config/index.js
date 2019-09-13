require('dotenv').config(); // environement config file

const ENV_VARS = process.env;

module.exports = {
    server: {
        domainName: ENV_VARS.AUTH_DOMAIN,
    },
    cache: {
        moduleTokenDuration: ENV_VARS.MODULE_TOKEN_DURATION,
        thirdPartyTokenDuration: ENV_VARS.THIRD_PARTY_TOKEN_DURATION,
        enableCaching: ENV_VARS.ENABLE_CACHING
    },
    auth: {
        authIdentity: ENV_VARS.IDENTITY,
        authSecret: ENV_VARS.SECRET,
        principalID: ENV_VARS.PRINCIPAL_ID,
        audience: ENV_VARS.DEFAULT_AUDIENCE || ['*'],
        set: function (authConfig) {
            this.authIdentity = authConfig.authIdentity;
            this.authSecret = authConfig.authSecret;
            this.principalID = authConfig.principalID;
            this.audience = authConfig.audience;
        },
        get: function () {
            return {
                identityName: this.authIdentity,
                secret: this.authSecret,
                principalID: this.principalID,
                audience: this.audience
            };
        }
    },
    logging: {
        logs: ENV_VARS.ENABLE_LOGGING
    }
};