const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin } = require('../helpers'),
    Identity = require('../../v1/index').Identity,
    expect = chai.expect;
chai.use(chaiAsPromised);


describe('get identity privileges', () => {

    describe('with auth', async () => {
        it('gets privileges as requested', async () => {
            nockLogin();
            nock('/identity/volcanic/privileges', 'get', {}, 200, {
                response: [
                    {
                        id: 5,
                        scope: 'vrn:{stack}:*:key/*',
                        permission_id: null,
                        group_id: 4,
                        allow: true,
                        subject_id: null,
                        created_at: '2020-06-10T09:31:48.068Z',
                        updated_at: '2020-06-10T09:31:48.068Z',
                        tag: 'automated',
                        _pivot_subject_id: 2,
                        _pivot_privilege_id: 5
                    }
                ]
            });
            let getAll = await new Identity().withAuth().getPrivileges('volcanic');
            expect(getAll).to.be.an('array');
        });

        it('fails if the name does not exist', async () => {
            nockLogin();
            nock('/identity/something/privileges', 'get', {}, 404, {
                message: 'Identity does not exist',
                errorCode: 1004
            });
            try {
                await new Identity().withAuth().getPrivileges('something');
            } catch (e) {
                expect(e.errorCode).to.equal(1004);
            }
        });

    });
});
