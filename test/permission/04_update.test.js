const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    Permission = require('../../v1').Permission,
    { nock, nockLogin } = require('../../src/helpers/test_helpers'),
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('update a permission', async () => {
    it('should update a permission', async () => {
        nockLogin();
        nock('/permissions/64', 'post', {
            name: 'updated_test_name'
        }, 200, {
            response: {
                id: 64,
                name: 'updated_test_name',
                description: null,
                subject_id: 2,
                service_id: 2,
                active: true,
                created_at: '2019-11-04T01:43:33.854Z',
                updated_at: '2019-11-04T02:16:25.915Z'
            }
        });
        let updatepermission = await new Permission().withAuth().update(64, 'updated_test_name');
        expect(updatepermission.name).to.equal('updated_test_name');
    });
    it('should not update a non-exist permission', async () => {
        try {
            nockLogin();
            nock('/permissions/1234213', 'post', {
                name: 'updated_test_name'
            }, 200, {
                message: 'Permission does not exist', errorCode: 5002
            });
            await new Permission().withAuth().update(1234213, 'updated_test_name');
        } catch (e) {
            expect(e.errorCode).to.equal(5002);
            expect(e.message).to.equal('Permission does not exist');
        }
    });
});