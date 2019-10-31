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

        axiosVCR.mountCassette('./test/cassettes/main_ops/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/main_ops/identity_login.json');
        axiosVCR.mountCassette('./test/cassettes/main_ops/privilege/create_for_delete.json');
        let create = await new Privilege().withAuth().create('vrn:{stack}:{dataset}:jobs/*', 1, 1, true);
        privilegeId = create.id;
        axiosVCR.ejectCassette('./test/cassettes/main_ops/privilege/create_for_delete.json');
    });
    it('fails deleting a non existing id', async () => {
        axiosVCR.mountCassette('./test/cassettes/privileges/delete/privilege_delete_fail.json', true);
        try {
            await new Privilege().withAuth().delete(432434);
            throw 'must not reach this line, the id is invalid';
        } catch (e) {
            expect(e.message).to.exist;
        }
        axiosVCR.ejectCassette('./test/cassettes/privileges/delete/privilege_delete_fail.json');
    });

    it('deletes the provided privilege', async () => {
        axiosVCR.mountCassette('./test/cassettes/privileges/delete/privilege_delete.json');
        let deletePriv = await new Privilege().withAuth().delete(privilegeId);
        expect(deletePriv.message).to.exist;
        axiosVCR.ejectCassette('./test/cassettes/privileges/delete/privilege_delete.json');
    });
});