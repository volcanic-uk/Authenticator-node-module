const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin } = require('../helpers'),
    Subject = require('../../v1/index').Subject,
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('get privileges by subject', () => {
    it('gets the privileges by subject', async () => {
        nock('/subject/privileges?filter[subject]=user://local1/-1/volcanic&filter[permission]=&filter[service]=', 'get', {}, 200, {
            response: [
                {
                    id: 1,
                    name: 'auth',
                    permissions: [
                        {
                            id: 1,
                            name: 'identity:create',
                            'privileges': [
                                {
                                    'id': 1,
                                    'scope': 'vrn:local1:*:identity/*',
                                    'allow': true
                                }
                            ]
                        },
                        {
                            id: 2,
                            name: 'identity:update',
                            privileges: [
                                {
                                    id: 1,
                                    scope: 'vrn:local1:*:identity/*',
                                    allow: true
                                }
                            ]
                        },
                        {
                            id: 3,
                            name: 'identity:deactivate',
                            privileges: [
                                {
                                    id: 1,
                                    scope: 'vrn:local1:*:identity/*',
                                    allow: true
                                }
                            ]
                        },
                        {
                            id: 4,
                            name: 'secret:reset',
                            privileges: [
                                {
                                    id: 1,
                                    scope: 'vrn:local1:*:identity/*',
                                    allow: true
                                }
                            ]
                        },
                        {
                            id: 5,
                            name: 'identity:generate_token',
                            privileges: [
                                {
                                    id: 1,
                                    scope: 'vrn:local1:*:identity/*',
                                    allow: true
                                }
                            ]
                        },
                        {
                            id: 6,
                            name: 'identity:update_roles',
                            privileges: [
                                {
                                    id: 1,
                                    scope: 'vrn:local1:*:identity/*',
                                    allow: true
                                }
                            ]
                        },
                        {
                            id: 7,
                            name: 'identity:get_privileges',
                            privileges: [
                                {
                                    id: 1,
                                    scope: 'vrn:local1:*:identity/*',
                                    allow: true
                                }
                            ]
                        },
                        {
                            id: 8,
                            name: 'identity:update_privileges',
                            privileges: [
                                {
                                    id: 1,
                                    scope: 'vrn:local1:*:identity/*',
                                    allow: true
                                }
                            ]
                        },
                        {
                            id: 9,
                            name: 'identity:get_roles',
                            privileges: [
                                {
                                    id: 1,
                                    scope: 'vrn:local1:*:identity/*',
                                    allow: true
                                }
                            ]
                        },
                        {
                            id: 10,
                            name: 'identity:get_all',
                            privileges: [
                                {
                                    id: 1,
                                    scope: 'vrn:local1:*:identity/*',
                                    allow: true
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        nockLogin();
        let read = await new Subject().withAuth().getPrivilegesBySubject({
            subject: 'user://local1/-1/volcanic',
            serviceName: '',
            permissionName: '',
        });
        expect(read).to.be.an('array');
    });
});