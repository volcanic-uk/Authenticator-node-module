const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin } = require('../helpers'),
    Role = require('../../v1').Roles,
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('get the roles by name', () => {

    it('should return the right role', async () => {
        nockLogin();
        nock('/roles/auth', 'get', {}, 200, {
            response: {
                id: 1,
                name: 'r*******t',
                subject_id: 2,
                created_at: '2019-11-01T03:53:46.332Z',
                updated_at: '2019-11-01T03:53:46.332Z'
            }
        });
        let read = await new Role().withAuth().getByName('auth');
        expect(read).to.be.instanceOf(Object).and.has.property('id');
    });

    it('will fail because the requested name is not available', async () => {
        try {
            nockLogin();
            nock('/roles/whatevername', 'get', {}, 404, {
                message: 'role does not exist', errorCode: 9001
            });
            await new Role().withAuth().getById('whatevername');
            throw 'it will not pass because the name does not exist';
        } catch (e) {
            expect(e.message).to.equal('role does not exist');
            expect(e.errorCode).to.equal(9001);
        }
    });

});