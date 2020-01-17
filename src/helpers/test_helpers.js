const { customFetch } = require('./index');
const envConfigs = require('../../config');
const Nock = require('nock');
const { Identity, Principal, Config } = require('../../v1');
require('dotenv').config();

const ENV_VARS = process.env;

const constants = {
    baseToken: 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjljYjg1YTc3YTllNWU0MTU3ODMyYTFlYTgzOTI3MDZhIn0.eyJleHAiOjE1NzM4MTMyNDMsInN1YiI6InVzZXI6Ly9zYW5kYm94Ly0xL3ZvbGNhbmljL3ZvbGNhbmljIiwibmJmIjoxNTczODA5NjQzLCJhdWRpZW5jZSI6WyJrcmFrYXRvYWV1IiwiLSJdLCJpYXQiOjE1NzM4MDk2NDMsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.AICDREeOUTZ5chlFUnvv20Fg3TjwHhwnsGE1NAvA3JXkI9RfJr61ocQo_CsVKZ41WW-EEjTpI5eeoC_jh3FRumf5AUs6Hm5EWC0O8YFZDWG3DWo946zXawYpj9iw4VpONHEPXco4xKclv8hH8WQJSu7rnOXbgD21FtzM5NSaUysvmPtk',
    secondToken: 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjljYjg1YTc3YTllNWU0MTU3ODMyYTFlYTgzOTI3MDZhIn0.eyJleHAiOjE1NzM4MTMyNTYsInN1YiI6InVzZXI6Ly9zYW5kYm94Ly0xL3ZvbGNhbmljL3ZvbGNhbmljIiwibmJmIjoxNTczODA5NjU2LCJhdWRpZW5jZSI6WyJrcmFrYXRvYWV1IiwiLSJdLCJpYXQiOjE1NzM4MDk2NTYsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.ALK-kF2CuHYT4zYP7ZgXXj__szoAmlPUOG--EjMK8qeHLED0VjzyaCJh59h9nGEDPiUvIpdA-GqYD5eqFLcpMhNbAS97fhnJKws3gzBbs-2zgPgePj2LU2vJiFd2imB4g3HtqsfoEo-MMkR5L6jjAVjx35bOZjxepSca53qI8-yiUUjf',
    identityUpdate1: '1c73a1b23b',
    identityUpdate2: '6ecf797d74',
    principal: '1b1c02dec1'
};

Config.auth.set({
    identity_name: ENV_VARS.AUTH_IDENTITY,
    secret: ENV_VARS.AUTH_SECRET,
    dataset_id: ENV_VARS.AUTH_DATASET_ID,
    audience: ENV_VARS.DEFAULT_AUDIENCE
});


exports.nock = (path, method, body, code, response) => {
    if (ENV_VARS.NOCK_OFF === 'false') {
        Nock(envConfigs.server.domainName + envConfigs.server.v1Api)
            .intercept(path, method.toUpperCase(), {
                ...body
            })
            .reply(code, {
                ...response
            });
    }
};

exports.nockLogin = async () => {
    if (envConfigs.auth.nock === 'false') {
        Nock(envConfigs.server.domainName + envConfigs.server.v1Api)
            .intercept('/identity/login', 'POST', {
                name: 'volcanic',
                secret: 'volcanic!123',
                dataset_id: '-1',
                audience: '["volcanic"]'
            })
            .reply(200, {
                response: {
                    response: {
                        token: envConfigs.auth.token
                    }
                },
                status: 200
            });
    }
};

exports.generateToken = async () => {
    if (envConfigs.auth.nock === 'true') {
        let response = await customFetch('POST', '/api/v1/identity/login', {}, {
            name: 'volcanic',
            secret: 'volcanic!123',
            audience: ['krakatoa-au'],
            dataset_id: '-1'
        });
        return response.response.token;
    } else {
        return envConfigs.auth.BaseToken;
    }
};

exports.generateIdentityOrPrincipal = async (type, name, timeStamp = null) => {
    if (envConfigs.auth.nock === 'true') {
        if (type === 'identity') {
            let response = await new Identity().withAuth().create(`identity_test_${timeStamp}`, null, 'volcanic');
            return response.secure_id;
        }
        if (type === 'principal') {
            let response = await new Principal().withAuth().create(`principal_test_${timeStamp}`, '111');
            return response.secure_id;
        }
    } else {
        return constants[name];
    }
};
