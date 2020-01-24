const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin } = require('../helpers'),
    Role = require('../../v1').Roles,
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('role get by name', () => {
    it('gets the right role by its name', async () => {
        nockLogin();
        nock('/roles/role-test', 'get', {}, 200, {
            response: {
                id: 7,
                name: 'r*******t',
                subject_id: 2,
                service_id: 2,
                created_at: '2019-11-01T03:53:46.332Z',
                updated_at: '2019-11-01T03:53:46.332Z'
            }
        });
        let read = await new Role().withAuth().getByName('role-test');
        expect(read).to.be.instanceOf(Object).and.has.property('id');
    });
    it('returns error if name doesnt exist', async () => {
        try {
            nockLogin();
            nock('/roles/no-proper-name', 'get', {}, 404, {
                message: 'role does not exist', errorCode: 9001
            });
            await new Role().withAuth().getByName('no-proper-name');
            throw 'should not return a role as name doesnt exist';
        } catch (e) {
            expect(e.message).to.equal('role does not exist');
            expect(e.errorCode).to.equal(9001);
        }
    });
});