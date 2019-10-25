const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);

const Principal = require('../../v1').Principal;

let principalID = null,
    tempPrincipalName = 'principal-test-read',
    tempDataSetID = '11';


describe('Principal read', () => {
    let principal = new Principal();
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/principal_create.json');
        let create = await principal.withAuth().create(tempPrincipalName, tempDataSetID);
        principalID = create.id;
        axiosVCR.ejectCassette('./test/cassettes/principal_create.json');
    });
    // reading principal
    it('should not proceed if the principal does not exist upon read request, and it will throw an error', async () => {
        axiosVCR.mountCassette('./test/cassettes/fail_principal_read.json', true);
        try {
            await principal.withAuth().getByID(principalID + 12);
            throw 'can not retrieve a principal that does not exist';
        } catch (e) {
            expect(e.message).equals('Principal does not exist');
        }
        axiosVCR.ejectCassette('./test/cassettes/fail_principal_read.json');
    });

    it('should fail when requesting a read request when there is no token in the request header, and it will throw an error', async () => {
        axiosVCR.mountCassette('./test/cassettes/fail_principal_token.json', true);
        try {
            await new Principal().getByID(principalID);
            throw 'should not reach this line, because the read request has no token, or it is malformed';
        } catch (e) {
            expect(e.message).to.be.equals('Forbidden');
        }
        axiosVCR.ejectCassette('./test/cassettes/fail_principal_token.json');
    });

    it('should return an object if the principal is found successfully while passing valid data', async () => {
        axiosVCR.mountCassette('./test/cassettes/principal_read.json');
        let read = await principal.withAuth().getByID('volcanic');
        axiosVCR.ejectCassette('./test/cassettes/principal_read.json');
        expect(read.id).to.exist;
    });

});