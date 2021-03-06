const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    { nock, nockLogin } = require('../helpers'),
    Role = require('../../v1').Roles,
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);

describe('Get all roles', () => {
    // get all roles
    it('should return the right role', async () => {
        nockLogin();
        nock('/roles?page=1&page_size=15&name=&query=&sort=id&order=asc&ids=7,8', 'get', {}, 200, {
            response: {
                pagination: [Object],
                data: [
                    {
                        'id': 7,
                        'name': 'role-test',
                        'subject_id': 2,
                        'service_id': 2,
                        'created_at': '2019-11-01T03:53:46.332Z',
                        'updated_at': '2019-11-01T03:53:46.332Z'
                    },
                    {
                        'id': 8,
                        'name': 'Role-157258149',
                        'subject_id': 2,
                        'service_id': 7,
                        'created_at': '2019-11-01T04:11:34.898Z',
                        'updated_at': '2019-11-01T04:11:34.898Z'
                    }
                ]
            }
        });
        let read = await new Role().withAuth().getRoles({
            page: 1,
            page_size:15,
            name: '',
            query:'',
            sort: 'id',
            order: 'asc',
            ids: '7,8'
        });
        expect(read.data).to.be.ascendingBy('id');
    });
});