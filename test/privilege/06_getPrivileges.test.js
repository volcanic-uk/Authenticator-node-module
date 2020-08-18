const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin } = require('../helpers'),
    Privileges = require('../../v1/index').Privilege,
    expect = chai.expect;
chai.use(chaiAsPromised);


describe('get privileges', () => {

    describe('with auth', async () => {
        it('gets privileges as requested', async () => {
            nockLogin();
            nock('/privileges?page=1&page_size=10&sort=id&order=asc&scope=&permission_id=&group_id=1&query=&tag=automated&allow=true', 'get', {}, 200, {
                response: {
                    pagination: {
                        page: 1,
                        pageSize: 10,
                        rowCount: 1,
                        pageCount: 1
                    },
                    data: [
                        {
                            id: 1,
                            scope: 'vrn:{stack}:*:identity/*',
                            permission_id: null,
                            group_id: 1,
                            allow: true,
                            subject_id: null,
                            created_at: '2020-08-04T06:20:34.695Z',
                            updated_at: '2020-08-04T06:20:34.695Z',
                            tag: 'automated'
                        }
                    ]
                }

            });
            let getAll = await new Privileges().withAuth().getPrivileges({
                page: 1,
                page_size: 10,
                sort: 'id',
                order: 'asc',
                group_id: 1,
                tag: 'automated',
                allow: true
            });
            expect(getAll.data).to.be.an('array');
        });

    });
});
