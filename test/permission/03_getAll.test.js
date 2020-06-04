const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    { nock, nockLogin } = require('../helpers'),
    Permission = require('../../v1').Permission,
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);

describe('should read all permissions', async () => {
    it('should read all permissions in ascending order', async () => {
        nockLogin();
        nock('/permissions?&page=&page_size=&sort=id&order=asc&ids=1,2', 'get', {}, 200, {
            response: {
                pagination: [Object], data: [
                    {
                        'id': 1,
                        'name': 'identity:create',
                        'description': null,
                        'subject_id': null,
                        'service_id': 1,
                        'active': true,
                        'created_at': '2019-10-31T09:33:20.270Z',
                        'updated_at': '2019-10-31T09:33:20.270Z'
                    },
                    {
                        'id': 2,
                        'name': 'identity:update',
                        'description': null,
                        'subject_id': null,
                        'service_id': 1,
                        'active': true,
                        'created_at': '2019-10-31T09:33:20.282Z',
                        'updated_at': '2019-10-31T09:33:20.282Z'
                    }
                ]
            }
        });
        let permissionsGetAll = await new Permission().withAuth().getPermissions('', '', 'id', 'asc', '1,2');
        expect(permissionsGetAll.data).to.be.ascendingBy('id');
    });
    it('should read all permissions in descending order', async () => {
        nockLogin();
        nock('/permissions?&page=&page_size=&sort=id&order=desc&ids=2,1', 'get', {}, 200, {
            response: {
                pagination: [Object], data: [
                    {
                        'id': 2,
                        'name': 'identity:update',
                        'description': null,
                        'subject_id': null,
                        'service_id': 1,
                        'active': true,
                        'created_at': '2019-10-31T09:33:20.282Z',
                        'updated_at': '2019-10-31T09:33:20.282Z'
                    },
                    {
                        'id': 1,
                        'name': 'identity:create',
                        'description': null,
                        'subject_id': null,
                        'service_id': 1,
                        'active': true,
                        'created_at': '2019-10-31T09:33:20.270Z',
                        'updated_at': '2019-10-31T09:33:20.270Z'
                    }
                ]
            }
        });
        let permissionsGetAll = await new Permission().withAuth().getPermissions('', '', 'id', 'desc', '2,1');
        expect(permissionsGetAll.data).to.be.descendingBy('id');
    });
});