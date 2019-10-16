const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);

const Principal = require('../../v1').Principal;
let currentTimestampSecond = 111,
    tempPrincipalName = 'principal-test',
    tempDataSetID = currentTimestampSecond;
describe('principal create test', () => {
    let principal = new Principal();
    it('should fail if principal creation function is called without a valid token and it will throw an error', async () => {
        axiosVCR.mountCassette('./test/cassettes/fail_principal_creation.json', true);
        try {
            await principal.create(tempPrincipalName, tempDataSetID);
            throw 'can not create principal with malformed or no token';
        } catch (e) {
            expect(e.message).to.be.equal('Forbidden');
        }
        axiosVCR.ejectCassette('./test/cassettes/fail_principal_creation.json');
    });

    it('should be a success when passing valid data, hence it will return an object carrying the created principal data', async () => {
        axiosVCR.mountCassette('./test/cassettes/principal_create.json');
        let create = await principal.withAuth().create(tempPrincipalName, tempDataSetID);
        axiosVCR.ejectCassette('./test/cassettes/principal_create.json');
        expect(create).to.be.instanceOf(Object).and.have.property('dataset_id').that.equals(tempDataSetID);
    });

    it('should not create a principal and it will throw an error if the name already exist', async () => {
        axiosVCR.mountCassette('./test/cassettes/principal_create_fail.json', true);
        try {
            await principal.withAuth().create(tempPrincipalName, tempDataSetID);
            throw 'should not reach this line, as the name is duplicated';
        } catch (e) {
            expect(e.message).to.exist;
        }

        axiosVCR.ejectCassette('./test/cassettes/principal_create_fail.json');
    });
});