const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin } = require('../../src/helpers/test_helpers'),
    Permission = require('../../v1').Permission,
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('delete a permission', async () => {

    it('should delete a permission', async () => {
        nockLogin();
        nock('/permissions/64', 'delete', {}, 200, {
            response: { message: 'Permission deleted successfully' }
        });
        let deletepermission = await new Permission().withAuth().delete(64);
        expect(deletepermission.message).to.exist;
    });
    it('should not delete a permission when it is already deleted', async () => {
        try {
            nockLogin();
            nock('/permissions/64', 'delete', {}, 410, {
                message: 'Permission already deleted', errorCode: 5002
            });
            await new Permission().withAuth().delete(64);
        } catch (e) {
            expect(e.errorCode).to.equal(5002);
            expect(e.message).to.equal('Permission already deleted');
        }
    });

    it('should not delete a permission that does not exist', async () => {
        try {
            nockLogin();
            nock('/permissions/1234231', 'delete', {}, 404, {
                message: 'Permission does not exist', errorCode: 5002
            });
            await new Permission().withAuth().delete(1234231);
        } catch (e) {
            expect(e.errorCode).to.equal(5002);
            expect(e.message).to.equal('Permission does not exist');
        }
    });
});