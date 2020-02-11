module.exports = {
    server: {
        domainName: 'http://localhost:8000',
        v1Api: '/api/v1',
        set: function (serverConfig) {
            this.domainName = serverConfig.domainName;
        },
        get: function () {
            return {
                domainName: this.domainName
            };
        }
    },
    cache: {
        moduleTokenDuration: '120',
        thirdPartyTokenDuration: '120',
        enableCaching: false,
        set: function (cacheConfig) {
            this.moduleTokenDuration = cacheConfig.moduleTokenDuration;
            this.thirdPartyTokenDuration = cacheConfig.thirdPartyTokenDuration;
            this.enableCaching = cacheConfig.enableCaching;
        },
        get: function () {
            return {
                moduleTokenDuration: this.moduleTokenDuration,
                thirdPartyTokenDuration: this.thirdPartyTokenDuration,
                enableCaching: this.enableCaching
            };
        }
    },
    auth: {
        identity_name: 'volcanic',
        secret: 'volcanic!123',
        dataset_id: '-1',
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
    logging: {
        logs: false,
        set: function (logConfig) {
            this.logs = logConfig.logs;
        },
        get: function () {
            return {
                logs: this.logs
            };
        }
    }
};