const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin } = require('../helpers'),
    Identity = require('../../v1/index').Identity,
    expect = chai.expect;
chai.use(chaiAsPromised);


describe('get identities', () => {

    describe('with auth', async () => {
        it('gets identities as requested', async () => {
            nockLogin();
            nock('/identity?query=&page=1&page_size=10&name=volcanic&source=password&dataset_id=&sort=created_at&order=asc&ids=volcanic,volcanic2&principal_id=volcanic', 'get', {}, 200, {
                response: {
                    pagination: {
                        page: 1,
                        pageSize: 15,
                        rowCount: 13,
                        pageCount: 1
                    },
                    data: [
                        {
                            id: 'volcanic',
                            name: 'volcanic',
                            dataset_id: '-1',
                            source: 'password',
                            last_active_date: null,
                            last_used_ip_address: null,
                            active: true,
                            created_at: '2020-02-04T08:22:58.036Z',
                            updated_at: '2020-02-04T08:22:58.036Z'
                        },
                        {
                            id: 'volcanic2',
                            name: 'volcanic2',
                            dataset_id: '-1',
                            source: 'password',
                            last_active_date: null,
                            last_used_ip_address: null,
                            active: true,
                            created_at: '2020-02-04T08:22:58.036Z',
                            updated_at: '2020-02-04T08:22:58.036Z'
                        }
                    ]
                }
            });
            let getAll = await new Identity().withAuth().getIdentities({
                page: '1',
                pageSize: '10',
                name: 'volcanic',
                source: 'password',
                dataset_id: '',
                sort: 'created_at',
                order: 'asc',
                ids:'volcanic,volcanic2',
                principal_id: 'volcanic',
            });
            expect(getAll.data).to.be.a('array');
            expect(getAll.data.length).to.be.equal(2);
        });
    });
});
