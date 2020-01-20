const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin } = require('../helpers'),
    Role = require('../../v1').Roles,
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('role delete', () => {
    it('deletes the required role', async () => {
        nockLogin();
        nock('/roles/7', 'delete', {}, 200, {
            response: {
                message: 'Successfully deleted role'
            }
        });
        let deleteIt = await new Role().withAuth().delete(7);
        expect(deleteIt.message).to.equal('Role deleted successfully');
    });

    it('fails deleting an already deleted role', async () => {
        try {
            nockLogin();
            nock('/roles/77', 'delete', {}, 404, {
                message: 'Role does not exist', errorCode: 9001
            });
            await new Role().withAuth().delete(77);
            throw 'should not reach this line because the id is gone';
        } catch (e) {
            expect(e.message).to.equal('Role does not exist');
            expect(e.errorCode).to.equal(9001);
        }
    });

    it('fails deleting a non existing role', async () => {
        try {
            nockLogin();
            nock('/roles/123132', 'delete', {}, 404, {
                message: 'Role does not exist', errorCode: 9001
            });
            await new Role().withAuth().delete(123132);
            throw 'should not reach this line because the id is not valid';
        } catch (e) {
            expect(e.message).to.equal('Role does not exist');
            expect(e.errorCode).to.equal(9001);
        }
    });
});