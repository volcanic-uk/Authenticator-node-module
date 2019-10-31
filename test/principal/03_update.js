const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);

const Principal = require('../../v1').Principal;
let currentTimestampSecond = '111',
    tempPrincipalName = 'principal-test-one',
    tempDataSetID = currentTimestampSecond,
    principalID = null;
describe('Principal updates', async () => {
    let principal = new Principal();
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/main_ops/principal/principal_update_test.json');
        let create = await principal.withAuth().create(tempPrincipalName, tempDataSetID);
        principalID = create.secure_id;
        axiosVCR.ejectCassette('./test/cassettes/main_ops/principal/principal_update_test.json');
    });
    //update principal
    it('upon principal update, the request should not be completed if there is no authorization token in the request header, and it will throw an error', async () => {
        axiosVCR.mountCassette('./test/cassettes/principals/update/principal_update_fail.json', true);
        try {
            await new Principal().update(principalID, 'new name', 12);
            throw 'should not read this line because the update request has no token, or it is malformed';
        } catch (e) {
            expect(e.message).to.exist;
        }
        axiosVCR.ejectCassette('./test/cassettes/principals/update/principal_update_fail.json');
    });

    it('should not update a principal that does not exist hence an error is thrown', async () => {
        axiosVCR.mountCassette('./test/cassettes/principals/update/principal_update_fail_duplicate.json', true);
        try {
            await principal.update(12, 'new name');
            throw 'should not reach this line because the principal requested does not exist';
        } catch (e) {
            expect(e.message).to.exist;
        }
        axiosVCR.ejectCassette('./test/cassettes/principals/update/principal_update_fail_duplicate.json');
    });

    it('should be a success when the principal is updated, thus it will return an object carrying the new attributes for the principal', async () => {
        axiosVCR.mountCassette('./test/cassettes/principals/update/principal_update.json');
        let update = await principal.withAuth().update(principalID, 'new name', 12);
        expect(update.dataset_id).to.exist;
        axiosVCR.ejectCassette('./test/cassettes/principals/update/principal_update.json');
    });
});
