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
        identity_name: ENV_VARS.IDENTITY,
        secret: ENV_VARS.SECRET,
        principal_id: ENV_VARS.PRINCIPAL_ID,
        dataset_id: ENV_VARS.DATASET_ID,
        audience: ENV_VARS.DEFAULT_AUDIENCE || ['*'],
        set: function (authConfig) {
            this.identity_name = authConfig.identity_name;
            this.secret = authConfig.secret;
            this.principal_id = authConfig.principal_id;
            this.audience = authConfig.audience;
        },
        get: function () {
            return {
                identity_name: this.identity_name,
                secret: this.secret,
                principal_id: this.principal_id,
                audience: this.audience
            };
        }
    },
    logging: {
        logs: ENV_VARS.ENABLE_LOGGING
    }
};