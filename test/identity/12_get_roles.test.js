const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin } = require('../helpers'),
    Identity = require('../../v1/index').Identity,
    expect = chai.expect;
chai.use(chaiAsPromised);


describe('get identity roles', () => {

    describe('with auth', async () => {
        it('gets identities as requested', async () => {
            nockLogin();
            nock('identity/volcanic/roles', 'get', {}, 200, {
                response: []
            });
            let getAll = await new Identity().withAuth().getRoles('volcanic');
            expect(getAll[0].id).to.exist;
        });

        it('fails if the name does not exist', async () => {
            nockLogin();
            nock('/identity/something/roles', 'get', {}, 200, {
                response: {
                    message: 'Identity does not exist',
                    errorCode: 1004
                }
            });
            try {
                await new Identity().withAuth().getRoles('something');
                throw 'should no reach this line of code';
            } catch (e) {
                expect(e.errorCode).to.equal(1004);
            }
        });

    });
});
