const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin } = require('../helpers'),
    Role = require('../../v1').Roles,
    expect = chai.expect;
chai.use(chaiAsPromised);
describe('Role update', async () => {
    let updateRole;
    it('updates the requested role', async () => {
        nockLogin();
        nock('/roles/7', 'post', {
            name: 'updated-name', privileges: [1, 2]
        }, 200, {
            response: {
                id: 7,
                name: 'u**********e',
                service_id: 2,
                created_at: '2019-11-01T03:53:46.332Z',
                updated_at: '2019-11-01T06:19:34.255Z'
            }
        });
        updateRole = await new Role().withAuth().update(7, 'updated-name', [1, 2]);
        expect(updateRole).to.instanceOf(Object).and.has.property('id');
    });
    it('updates the parent_id of requested role', async () => {
        nockLogin();
        nock('/roles/7', 'post', {
            name: 'updated-name', privileges: [1, 2], parent_id: updateRole.id
        }, 200, {
            response: {
                id: 7,
                name: 'u**********e',
                service_id: 2,
                created_at: '2019-11-01T03:53:46.332Z',
                updated_at: '2019-11-01T06:19:34.255Z'
            }
        });
        let update = await new Role().withAuth().update(7, 'updated-name', [1, 2], updateRole.id);
        expect(update).to.instanceOf(Object).and.has.property('id');
    });

    it('fails when getting a non-existing role', async () => {
        try {
            nockLogin();
            nock('/roles/123451', 'post', {
                name: 'updated-name', privileges: [1, 2]
            }, 404, {
                message: 'Role does not exist', errorCode: 9001
            });
            await new Role().withAuth().update(123451, 'updated-name', [1, 2]);
            throw 'should not reach this line, for the id does not exist';
        } catch (e) {
            expect(e.message).to.equal('Role does not exist');
            expect(e.errorCode).to.equal(9001);
        }
    });
});