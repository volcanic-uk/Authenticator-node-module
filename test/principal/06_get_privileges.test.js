const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin } = require('../helpers'),
    Principal = require('../../v1/index').Principal,
    expect = chai.expect;
chai.use(chaiAsPromised);


describe('get principal privileges', () => {

    describe('with auth', async () => {
        it('gets privileges as requested', async () => {
            nockLogin();
            nock('/principals/volcanic/privileges', 'get', {}, 200, {
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
                        _pivot_subject_id: 1,
                        _pivot_privilege_id: 5
                    }
                ]
            });
            let getAll = await new Principal().withAuth().getPrivileges('volcanic');
            expect(getAll).to.be.an('array');
        });

        it('fails if the name does not exist', async () => {
            nockLogin();
            nock('/principals/something/privileges', 'get', {}, 404, {
                message: 'Principal does not exist',
                errorCode: 2002
            });
            try {
                await new Principal().withAuth().getPrivileges('something');
            } catch (e) {
                expect(e.errorCode).to.equal(2002);
            }
        });

    });
});
