const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin } = require('../helpers'),
    Principal = require('../../v1/index').Principal,
    expect = chai.expect;
chai.use(chaiAsPromised);


describe('get principal roles', () => {

    describe('with auth', async () => {
        it('gets roles as requested', async () => {
            nockLogin();
            nock('/principals/volcanic/roles', 'get', {}, 200, {
                response: [
                    {
                        id: 1,
                        name: 'authenticator_super_user',
                        subject_id: null,
                        created_at: '2020-03-12T07:06:12.681Z',
                        updated_at: '2020-03-12T07:06:12.681Z',
                        parent_id: null,
                        _pivot_subject_id: 19,
                        _pivot_role_id: 1
                    }
                ]
            });
            let getAll = await new Principal().withAuth().getRoles('volcanic');
            expect(getAll).to.be.an('array');
        });

        it('fails if the name does not exist', async () => {
            nockLogin();
            nock('/principals/something/roles', 'get', {}, 404, {
                message: 'Principal does not exist',
                errorCode: 2002
            });
            try {
                await new Principal().withAuth().getRoles('something');
            } catch (e) {
                expect(e.errorCode).to.equal(2002);
            }
        });

    });
});
