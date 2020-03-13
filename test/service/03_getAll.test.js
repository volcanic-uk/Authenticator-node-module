const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    { nock, nockLogin } = require('../helpers'),
    Service = require('../../v1').Service,
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);

describe('should read all services', async () => {

    it('should return the right role', async () => {
        nockLogin();
        nock('/services?&page=1&page_size=15&sort=id&order=asc', 'get', {}, 200, {
            response: {
                pagination: [Object],
                data: [
                    {
                        'id': 1,
                        'name': 'auth',
                        'active': true,
                        'subject_id': null,
                        'created_at': '2019-10-31T09:33:20.217Z',
                        'updated_at': '2019-10-31T09:33:20.217Z'
                    },
                    {
                        'id': 2,
                        'name': 'krakatoa',
                        'active': true,
                        'subject_id': null,
                        'created_at': '2019-10-31T09:33:20.905Z',
                        'updated_at': '2019-10-31T09:33:20.905Z'
                    }
                ]
            }
        });
        let servicesGetAll = await new Service().withAuth().getServices(1, 15, 'id', 'asc');
        expect(servicesGetAll.data).to.be.ascendingBy('id');
    });

    it('should read all services in descending order', async () => {
        nockLogin();
        nock('/services?&page=1&page_size=15&sort=id&order=desc', 'get', {}, 200, {
            response: {
                pagination: [Object],
                data: [
                    {
                        'id': 2,
                        'name': 'krakatoa',
                        'active': true,
                        'subject_id': null,
                        'created_at': '2019-10-31T09:33:20.905Z',
                        'updated_at': '2019-10-31T09:33:20.905Z'
                    },
                    {
                        'id': 1,
                        'name': 'auth',
                        'active': true,
                        'subject_id': null,
                        'created_at': '2019-10-31T09:33:20.217Z',
                        'updated_at': '2019-10-31T09:33:20.217Z'
                    }
                ]
            }
        });
        let servicesGetAll = await new Service().withAuth().getServices(1, 15, 'id', 'desc');
        expect(servicesGetAll.data).to.be.descendingBy('id');
    });
});