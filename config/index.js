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
        identity_name: ENV_VARS.AUTH_IDENTITY,
        secret: ENV_VARS.AUTH_SECRET,
        dataset_id: ENV_VARS.AUTH_DATASET_ID,
        audience: ENV_VARS.AUTH_DEFAULT_AUDIENCE || ['*'],
        set: function (authConfig) {
            this.identity_name = authConfig.identity_name;
            this.secret = authConfig.secret;
            this.dataset_id = authConfig.dataset_id;
            this.audience = authConfig.audience;
        },
        get: function () {
            return {
                identity_name: this.identity_name,
                secret: this.secret,
                dataset_id: this.dataset_id,
                audience: this.audience
            };
        }
    },
    logging: {
        logs: ENV_VARS.ENABLE_LOGGING
    }
};