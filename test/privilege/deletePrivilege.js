const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);

const Identity = require('../../v1/index').Identity,
    Privilege = require('../../v1').Privilege;

let privilegeId = null,
    token;
describe('delete privileges', () => {
    before(async () => {

        axiosVCR.mountCassette('./test/cassettes/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/identity_login.json');
        axiosVCR.mountCassette('./test/cassettes/privilege-create.json');
        let create = await new Privilege().withAuth().create('vrn:{stack}:{dataset}:jobs/*', 1, 1, true);
        privilegeId = create.id;
        axiosVCR.ejectCassette('./test/cassettes/privilege-create.json');
    });
    it('fails deleting a non existing id', async () => {
        axiosVCR.mountCassette('./test/cassettes/fail-privilege-update-fail.json', true);
        try {
            await new Privilege().withAuth().delete(432434);
            throw 'must not reach this line, the id is invalid';
        } catch (e) {
            expect(e.message).to.exist;
        }
        axiosVCR.ejectCassette('./test/cassettes/fail-privilege-update-fail.json');
    });

    it('deletes the provided privilege', async () => {
        axiosVCR.mountCassette('./test/cassettes/privilege-delete.json');
        let deletePriv = await new Privilege().withAuth().delete(privilegeId);
        axiosVCR.ejectCassette('./test/cassettes/privilege-delete.json');
        expect(deletePriv.message).to.exist;
    });
});