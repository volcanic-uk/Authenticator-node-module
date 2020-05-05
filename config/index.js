module.exports = {
    server: {
        domainName: 'http://localhost:8000',
        stack_id: 'sandbox',
        set: function (serverConfig) {
            this.domainName = serverConfig.domainName;
            this.stack_id = serverConfig.stack_id;
        },
        get: function () {
            return {
                domainName: this.domainName,
                stack_id: this.stack_id
            };
        }
    },
    cache: {
        enableCaching: true,
        set: function (cacheConfig) {
            this.enableCaching = cacheConfig.enableCaching;
        },
        get: function () {
            return {
                enableCaching: this.enableCaching
            };
        }
    },
    auth: {
        identity_name: 'AUTH_IDENTITY',
        secret: 'AUTH_SECRET',
        dataset_id: 'AUTH_DATASET_ID',
        audience: ['*'],
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
};