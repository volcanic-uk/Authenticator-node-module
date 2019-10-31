const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    expect = chai.expect,
    nock = require('../../src/helpers').nock;
chai.use(chaiAsPromised);
chai.use(sorted);


const Principal = require('../../v1').Principal;

let currentTimestampSecond = '111',
    tempPrincipalName = 'principal-test',
    tempDataSetID = currentTimestampSecond;

describe('principal create test', () => {
    let principal = new Principal();
    it('should fail if principal creation function is called without a valid token and it will throw an error', async () => {
        try {
            nock('/principals', 'post', {
                name: tempPrincipalName,
                dataset_id: tempDataSetID
            }, 403, {
                message: 'Forbidden',
                errorCode: 3001
            });
            await principal.create(tempPrincipalName, tempDataSetID);
            throw 'can not create principal with malformed or no token';
        } catch (e) {
            expect(e.message).to.be.equal('Forbidden');
        }
    });

    it('should be a success when passing valid data, hence it will return an object carrying the created principal data', async () => {
        nock('/principals', 'post', {
            name: tempPrincipalName,
            dataset_id: tempDataSetID
        }, 201, {
            name: 'p************t',
            dataset_id: '111',
            secure_id: '334e5b1dd2',
            updated_at: '2019-10-31T04:33:06.089Z',
            created_at: '2019-10-31T04:33:06.089Z',
            id: 2
        });
        nock('/identity/login', 'post', {
            name: 'volcanic',
            audience: ['volcanic'],
            secret: 'volcanic!123',
            dataset_id: '-1'
        }, 200, {
            token: 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjljYjg1YTc3YTllNWU0MTU3ODMyYTFlYTgzOTI3MDZhIn0.eyJleHAiOjE1NzI0OTYzNDIsInN1YiI6InVzZXI6Ly9zYW5kYm94Ly0xLzEvMS8yIiwibmJmIjoxNTcyNDkyNzQyLCJhdWRpZW5jZSI6WyJrcmFrYXRvYWV1IiwiLSJdLCJpYXQiOjE1NzI0OTI3NDIsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.AIIsVxwqsYWg3DqusQhC8qeBbIX22Rk6fZHwY2iNgnU-ghOJDmK9QNMZbqJDul5hqTXfFyB7HVw0SBXjivPtFunDAOytU-JupKTl7qgveRiU0oVMdtrtEI7iSNXS30p2ulEu0bumUjibTEW4oig0K4LJYoNxht_rPosOx_NPqCxp1ljB'
        });
        let create = await principal.withAuth().create(tempPrincipalName, tempDataSetID);
        expect(create).to.be.instanceOf(Object).and.have.property('dataset_id').that.equals(tempDataSetID);
    });

    it('should not create a principal and it will throw an error if the name already exist', async () => {
        try {
            await principal.withAuth().create(tempPrincipalName, tempDataSetID);
            throw 'should not reach this line, as the name is duplicated';
        } catch (e) {
            expect(e.message).to.exist;
        }
    });
});