module.exports = {
    server: {
        domainName: 'http://localhost:8000',
        v1Api: '/api/v1'
    },
    cache: {
        moduleTokenDuration: '120',
        thirdPartyTokenDuration: '120',
        enableCaching: false
    },
    auth: {
        identity_name: 'volcanic',
        secret: 'secret',
        dataset_id: 'datset_id',
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
        logs: false
    }
};