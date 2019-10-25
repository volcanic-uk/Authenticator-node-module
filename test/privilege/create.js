const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);

const Identity = require('../../v1/index').Identity,
    Privilege = require('../../v1/index').Privilege;
let token;
// create privileges
describe('creates privilege', () => {
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/identity_login.json');
    });
    it('fails when the token is invalid', async () => {
        axiosVCR.mountCassette('./test/cassettes/fail-privilege-token.json', true);
        try {
            await new Privilege().setToken('sometoken').create('vrn:{stack}:{dataset}:jobs/*', 1, 1, true);
            throw 'must not reach this line because the token is invalid';
        } catch (e) {
            expect(e.message).to.equal('Forbidden');
        }
        axiosVCR.ejectCassette('./test/cassettes/fail-privilege-token.json');

    });
    it('creates a new privilege', async () => {
        axiosVCR.mountCassette('./test/cassettes/privilege-create.json');
        let create = await new Privilege().withAuth().create('vrn:{stack}:{dataset}:jobs/*', 1, 1, true);
        axiosVCR.ejectCassette('./test/cassettes/privilege-create.json');
        expect(create).to.be.an.instanceOf(Object).and.have.property('group_id');
    });
});


