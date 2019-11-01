const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    nock = require('../../src/helpers').nock,
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);

const Principal = require('../../v1').Principal;
describe('principal delete', async () => {
    let principal = new Principal();

    // delete principal
    it('should not pass upon deleting because the header does not have a valid authorization token, and it will throw an error', async () => {
        try {
            nock('/principals/334e5b1dd2', 'delete', {}, 403, {
                message: 'Forbidden', errorCode: 3001
            });
            await new Principal().delete('334e5b1dd2',);
            throw 'should not reach this line, because the token is not valid';
        } catch (e) {
            expect(e.message).equals('Forbidden');
            expect(e.errorCode).equals(3001);
        }
    });

    it('should return a success message upon valid request of deleting the principal via ID', async () => {
        nock('/identity/login', 'post', {
            name: 'volcanic',
            secret: 'volcanic!123',
            dataset_id: '-1',
            audience: '["volcanic"]'
        }, 200, {
            response: {
                response: {
                    token: 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjljYjg1YTc3YTllNWU0MTU3ODMyYTFlYTgzOTI3MDZhIn0.eyJleHAiOjE1NzI0OTYzNDIsInN1YiI6InVzZXI6Ly9zYW5kYm94Ly0xLzEvMS8yIiwibmJmIjoxNTcyNDkyNzQyLCJhdWRpZW5jZSI6WyJrcmFrYXRvYWV1IiwiLSJdLCJpYXQiOjE1NzI0OTI3NDIsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.AIIsVxwqsYWg3DqusQhC8qeBbIX22Rk6fZHwY2iNgnU-ghOJDmK9QNMZbqJDul5hqTXfFyB7HVw0SBXjivPtFunDAOytU-JupKTl7qgveRiU0oVMdtrtEI7iSNXS30p2ulEu0bumUjibTEW4oig0K4LJYoNxht_rPosOx_NPqCxp1ljB'
                }
            },
            status: 200
        });
        nock('/principals/334e5b1dd2', 'delete', {}, 200, {
            response: { message: 'Successfully deleted' }
        });
        let deleted = await principal.withAuth().delete('334e5b1dd2');
        expect(deleted.message).to.equal('Successfully deleted');
    });
});