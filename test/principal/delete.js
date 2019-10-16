const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);
let token;
const Principal = require('../../v1').Principal,
    Identity = require('../../v1').Identity;
let currentTimestampSecond = 111,
    tempPrincipalName = 'principal-test-delete',
    tempDataSetID = currentTimestampSecond;
describe('principal delete', async () => {
    let principal = new Principal();
    before(async () => {

        axiosVCR.mountCassette('./test/cassettes/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], 1);
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/identity_login.json');
        axiosVCR.mountCassette('./test/cassettes/principal_create.json');
        await principal.withAuth().create(tempPrincipalName, tempDataSetID);
        axiosVCR.ejectCassette('./test/cassettes/principal_create.json');
    });
    // delete principal
    it('should not pass upon deleting because the header does not have a valid authorization token, and it will throw an error', async () => {
        axiosVCR.mountCassette('./test/cassettes/fail_principal_delete.json', true);
        try {
            await new Principal().delete(1);
            throw 'should not reach this line, because the token is not valid';
        } catch (e) {
            expect(e.message).equals('Forbidden');
        }
        axiosVCR.ejectCassette('./test/cassettes/fail_principal_delete.json');
    });

    it('should return a success message upon valid request of deleting the principal via ID', async () => {
        axiosVCR.mountCassette('./test/cassettes/principal_delete.json');
        let deleted = await principal.withAuth().delete(2);
        axiosVCR.ejectCassette('./test/cassettes/principal_delete.json');
        expect(deleted.message).to.exist;
    });
});