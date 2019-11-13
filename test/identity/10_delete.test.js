const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    nock = require('../../src/helpers').nock,
    Identity = require('../../v1/index').Identity,
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('Identity delete', () => {
    describe('with auth', async () => {

        it('should delete identity', async () => {
            nock('/identity/login', 'post', {
                name: 'volcanic',
                secret: 'volcanic!123',
                dataset_id: '-1',
                audience: '["volcanic"]'
            }, 200, {
                response: {
                    response: {
                        token: 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjljYjg1YTc3YTllNWU0MTU3ODMyYTFlYTgzOTI3MDZhIn0.eyJleHAiOjE1NzM0NDY4NDQsInN1YiI6InVzZXI6Ly9zYW5kYm94Ly0xL3ZvbGNhbmljL3ZvbGNhbmljIiwibmJmIjoxNTczNDQzMjQ0LCJhdWRpZW5jZSI6WyJrcmFrYXRvYWV1IiwiLSJdLCJpYXQiOjE1NzM0NDMyNDQsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.AfnCn03e2RcXhSCRrpeSgxN0urZXSRsIylKMUMNKFo0rqhaicVkUDekQL0SaK7-eU2iYaEYtbQ9IMt_X-cujxqdmACOKCNtZK_X7VMBEnLPcOrN23vxrm4Mz229nEM6T2lvtPLbz1M6Vm3GFpokbMmseLZiSQQP-xy4niSvs0hyffZaT'
                    }
                },
                status: 200
            });
            nock('/identity/89105628cc', 'delete', '', 200, {
                requestID: 'offline_awsRequestId_9275859723252489',
                response: { message: 'Successfully deleted identity' }
            });
            let deactivateIdentity = await new Identity().withAuth().delete('89105628cc');
            expect(deactivateIdentity.message).to.equal('Successfully deleted identity');
        });

        it('should not delete already deleted identity', async () => {
            try {
                nock('/identity/login', 'post', {
                    name: 'volcanic',
                    secret: 'volcanic!123',
                    dataset_id: '-1',
                    audience: '["volcanic"]'
                }, 200, {
                    response: {
                        response: {
                            token: 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjljYjg1YTc3YTllNWU0MTU3ODMyYTFlYTgzOTI3MDZhIn0.eyJleHAiOjE1NzM0NDY4NDQsInN1YiI6InVzZXI6Ly9zYW5kYm94Ly0xL3ZvbGNhbmljL3ZvbGNhbmljIiwibmJmIjoxNTczNDQzMjQ0LCJhdWRpZW5jZSI6WyJrcmFrYXRvYWV1IiwiLSJdLCJpYXQiOjE1NzM0NDMyNDQsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.AfnCn03e2RcXhSCRrpeSgxN0urZXSRsIylKMUMNKFo0rqhaicVkUDekQL0SaK7-eU2iYaEYtbQ9IMt_X-cujxqdmACOKCNtZK_X7VMBEnLPcOrN23vxrm4Mz229nEM6T2lvtPLbz1M6Vm3GFpokbMmseLZiSQQP-xy4niSvs0hyffZaT'
                        }
                    },
                    status: 200
                });
                nock('/identity/a0c487ae3c', 'delete', '', 404, {
                    requestID: 'offline_awsRequestId_3501575564179309',
                    message: 'Identity does not exist',
                    errorCode: 1004
                });
                await new Identity().withAuth().delete('a0c487ae3c');
                throw Error('The code should not reach this scope as identity already deactivated');
            } catch (e) {
                expect(e.errorCode).to.equal(1004);
            }

        });

    });


    describe('without auth and with setToken', async () => {
        it('should deactivate identity', async () => {
            nock('/identity/login', 'post', {
                name: 'volcanic',
                secret: 'volcanic!123',
                dataset_id: '-1',
                audience: '["volcanic"]'
            }, 200, {
                response: {
                    response: {
                        token: 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjljYjg1YTc3YTllNWU0MTU3ODMyYTFlYTgzOTI3MDZhIn0.eyJleHAiOjE1NzM0NDY4NDQsInN1YiI6InVzZXI6Ly9zYW5kYm94Ly0xL3ZvbGNhbmljL3ZvbGNhbmljIiwibmJmIjoxNTczNDQzMjQ0LCJhdWRpZW5jZSI6WyJrcmFrYXRvYWV1IiwiLSJdLCJpYXQiOjE1NzM0NDMyNDQsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.AfnCn03e2RcXhSCRrpeSgxN0urZXSRsIylKMUMNKFo0rqhaicVkUDekQL0SaK7-eU2iYaEYtbQ9IMt_X-cujxqdmACOKCNtZK_X7VMBEnLPcOrN23vxrm4Mz229nEM6T2lvtPLbz1M6Vm3GFpokbMmseLZiSQQP-xy4niSvs0hyffZaT'
                    }
                },
                status: 200
            });
            nock('/identity/4f4db3acd2', 'delete', '', 200, {
                requestID: 'offline_awsRequestId_9275859723252489',
                response: { message: 'Successfully deleted identity' }
            });
            let token = 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjljYjg1YTc3YTllNWU0MTU3ODMyYTFlYTgzOTI3MDZhIn0.eyJleHAiOjE1NzM0NDY4NDQsInN1YiI6InVzZXI6Ly9zYW5kYm94Ly0xL3ZvbGNhbmljL3ZvbGNhbmljIiwibmJmIjoxNTczNDQzMjQ0LCJhdWRpZW5jZSI6WyJrcmFrYXRvYWV1IiwiLSJdLCJpYXQiOjE1NzM0NDMyNDQsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.AfnCn03e2RcXhSCRrpeSgxN0urZXSRsIylKMUMNKFo0rqhaicVkUDekQL0SaK7-eU2iYaEYtbQ9IMt_X-cujxqdmACOKCNtZK_X7VMBEnLPcOrN23vxrm4Mz229nEM6T2lvtPLbz1M6Vm3GFpokbMmseLZiSQQP-xy4niSvs0hyffZaT';
            let deactivateIdentity = await new Identity().setToken(token).delete('4f4db3acd2');
            expect(deactivateIdentity.message).to.equal('Successfully deleted identity');
        });

        it('should not deactivate already deleted identity', async () => {
            try {
                nock('/identity/login', 'post', {
                    name: 'volcanic',
                    secret: 'volcanic!123',
                    dataset_id: '-1',
                    audience: '["volcanic"]'
                }, 200, {
                    response: {
                        response: {
                            token: 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjljYjg1YTc3YTllNWU0MTU3ODMyYTFlYTgzOTI3MDZhIn0.eyJleHAiOjE1NzM0NDY4NDQsInN1YiI6InVzZXI6Ly9zYW5kYm94Ly0xL3ZvbGNhbmljL3ZvbGNhbmljIiwibmJmIjoxNTczNDQzMjQ0LCJhdWRpZW5jZSI6WyJrcmFrYXRvYWV1IiwiLSJdLCJpYXQiOjE1NzM0NDMyNDQsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.AfnCn03e2RcXhSCRrpeSgxN0urZXSRsIylKMUMNKFo0rqhaicVkUDekQL0SaK7-eU2iYaEYtbQ9IMt_X-cujxqdmACOKCNtZK_X7VMBEnLPcOrN23vxrm4Mz229nEM6T2lvtPLbz1M6Vm3GFpokbMmseLZiSQQP-xy4niSvs0hyffZaT'
                        }
                    },
                    status: 200
                });
                nock('/identity/4683245189', 'delete', '', 404, {
                    requestID: 'offline_awsRequestId_3501575564179309',
                    message: 'Identity does not exist',
                    errorCode: 1004
                });
                let token = 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjljYjg1YTc3YTllNWU0MTU3ODMyYTFlYTgzOTI3MDZhIn0.eyJleHAiOjE1NzM0NDY4NDQsInN1YiI6InVzZXI6Ly9zYW5kYm94Ly0xL3ZvbGNhbmljL3ZvbGNhbmljIiwibmJmIjoxNTczNDQzMjQ0LCJhdWRpZW5jZSI6WyJrcmFrYXRvYWV1IiwiLSJdLCJpYXQiOjE1NzM0NDMyNDQsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.AfnCn03e2RcXhSCRrpeSgxN0urZXSRsIylKMUMNKFo0rqhaicVkUDekQL0SaK7-eU2iYaEYtbQ9IMt_X-cujxqdmACOKCNtZK_X7VMBEnLPcOrN23vxrm4Mz229nEM6T2lvtPLbz1M6Vm3GFpokbMmseLZiSQQP-xy4niSvs0hyffZaT';
                await new Identity().setToken(token).delete('4683245189');
                throw Error('The code should not reach this scope as identity already deactivated');
            } catch (e) {
                expect(e.errorCode).to.equal(1004);
            }
        });

    });
});