const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin } = require('../helpers'),
    Role = require('../../v1').Roles,
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('get the roles by id', () => {

    it('should return the right role', async () => {
        nockLogin();
        nock('/roles/1', 'get', {}, 200, {
            response: {
                id: 1,
                name: 'r*******t',
                subject_id: 2,
                created_at: '2019-11-01T03:53:46.332Z',
                updated_at: '2019-11-01T03:53:46.332Z'
            }
        });
        let read = await new Role().withAuth().getById(1);
        expect(read).to.be.instanceOf(Object).and.has.property('id');
    });

    it('will fail because the requested id is not available', async () => {
        try {
            nockLogin();
            nock('/roles/123412', 'get', {}, 404, {
                message: 'role does not exist', errorCode: 9001
            });
            await new Role().withAuth().getById(123412);
            throw 'it will not pass because the name does not exist';
        } catch (e) {
            expect(e.message).to.equal('role does not exist');
            expect(e.errorCode).to.equal(9001);
        }
    });

});