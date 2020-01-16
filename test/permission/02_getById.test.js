const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin } = require('../../src/helpers/test_helpers'),
    expect = chai.expect;
chai.use(chaiAsPromised);

const Permission = require('../../v1').Permission;

describe('should read created permission', async () => {
    it('should read a permission', async () => {
        nockLogin();
        nock('/permissions/64', 'get', {}, 200, {
            response: {
                id: 64,
                name: 'n****************1',
                description: 'this is new permission',
                subject_id: 2,
                service_id: 2,
                active: true,
                created_at: '2019-11-04T01:43:33.854Z',
                updated_at: '2019-11-04T01:43:33.854Z'
            }
        });
        let permissionRead = await new Permission().withAuth().getByID(64);
        expect(permissionRead.id).to.exist;
    });
    it('should not read permission with wrong id', async () => {
        try {
            nockLogin();
            nock('/permissions/123231', 'get', {}, 404, {
                message: 'Permission does not exist', errorCode: 5002
            });
            await new Permission().withAuth().getByID(123231);
        } catch (e) {
            expect(e.errorCode).to.equal(5002);
            expect(e).to.exist;
        }
    });
});