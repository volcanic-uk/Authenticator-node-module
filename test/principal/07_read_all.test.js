const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin } = require('../helpers'),
    Principal = require('../../v1/index').Principal,
    expect = chai.expect;
chai.use(chaiAsPromised);


describe('get principals', () => {

    describe('with auth', async () => {
        it('gets principals as requested', async () => {
            nockLogin();
            nock('/principals?query=&dataset_id=&page=1&page_size=10&sort=created_at&order=asc&name=volcanic-principal&ids=volcanic', 'get', {}, 200, {
                response: {
                    pagination: {
                        page: 1,
                        pageSize: 10,
                        rowCount: 1,
                        pageCount: 1
                    },
                    data: [
                        {
                            secure_id: 'volcanic',
                            id: 'volcanic',
                            name: 'volcanic-principal',
                            dataset_id: '-1',
                            last_active_date: null,
                            active: true,
                            created_at: '2020-06-04T02:02:47.644Z',
                            updated_at: '2020-06-04T04:49:32.003Z'
                        }
                    ]
                }
            });
            let getAll = await new Principal().withAuth().getPrincipals({
                query: '',
                dataset_id: '',
                page: 1,
                page_size: 10,
                sort: 'created_at',
                order: 'asc',
                name: 'volcanic-principal',
                ids: 'volcanic'
            });
            console.log('show get all', getAll);
            expect(getAll.data).to.be.a('array');
        });

        it('fails if the name does not exist', async () => {
            nockLogin();
            nock('/principals?query=&dataset_id=&page=1&page_size=10&sort=created_at&order=asc&name=incorrect-name&ids=volcanic', 'get', {}, 200, {
                response: {
                    pagination: {
                        page: 1,
                        pageSize: 10,
                        rowCount: 1,
                        pageCount: 1
                    },
                    data: []
                }
            });
            let getAll = await new Principal().withAuth().getPrincipals({
                query: '',
                dataset_id: '',
                page: 1,
                page_size: 10,
                sort: 'created_at',
                order: 'asc',
                name: 'incorrect-name',
                ids: 'volcanic'
            });

            expect(getAll.data.length).to.equal(0);
        });

    });
});
