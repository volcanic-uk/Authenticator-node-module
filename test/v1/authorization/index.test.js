const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { generateToken, nock } = require('../../helpers'),
    { Authorization } = require('../../../v1'),
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('Authorization tests', function () {
    let token;
    before(async () => {
        token = await generateToken();
    });
    it('should authorize the request', async () => {
        nock('/privileges/identity', 'get', {}, 200, {
            response: [
                {
                    'id': 1,
                    'name': 'auth',
                    'permissions': [
                        {
                            'id': 1,
                            'name': 'identity:create',
                            'privileges': [
                                {
                                    'id': 1,
                                    'scope': 'vrn:local:-1:identity/*',
                                    'allow': true
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        const authorization = new Authorization().setToken(token);
        const result = await authorization.authorize({
            serviceName: 'auth',
            datasetID: '-1',
            permissionName: 'identity:create',
            resourceType: 'identity',
            resourceID: '1'
        });
        expect(result).to.eq(true);
    });

    it('should not authorize the request if required privileges are missing', async () => {
        nock('/privileges/identity', 'get', {}, 200, {
            response: [
                {
                    'id': 1,
                    'name': 'auth',
                    'permissions': [
                        {
                            'id': 1,
                            'name': 'identity:update',
                            'privileges': [
                                {
                                    'id': 1,
                                    'scope': 'vrn:sandbox:-1:identity/*',
                                    'allow': true
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        const authorization = new Authorization().setToken(token);
        try {
            await authorization.authorize({
                serviceName: 'auth',
                datasetID: '-1',
                permissionName: 'identity:create',
                resourceType: 'identity',
                resourceID: '1'
            });
        } catch (e) {
            expect(e.message).to.eq('You are not allowed to perform this action for dataset_id of -1 resource type of identity on resource id of 1');
        }
    });
});