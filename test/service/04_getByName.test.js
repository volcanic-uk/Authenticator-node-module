const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin } = require('../../src/helpers/test_helpers'),
    Service = require('../../v1').Service,
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('get service by name', () => {

    it('should read a service by name', async () => {
        nockLogin();
        nock('/services/service_for_test', 'get', {}, 200, {
            response: {
                id: 1,
                name: 'a**h',
                active: true,
                subject_id: null,
                created_at: '2019-10-31T09:33:20.217Z',
                updated_at: '2019-10-31T09:33:20.217Z'
            }
        });
        let serviceRead = await new Service().withAuth().getByName('service_for_test');
        expect(serviceRead.id).to.exist;
    });

    it('should not read service with non existence name', async () => {
        try {
            nockLogin();
            nock('/services/MUJANNAD', 'get', {}, 404, {
                message: 'Service does not exist', errorCode: 6002
            });
            await new Service().withAuth().getByName('MUJANNAD');
        } catch (e) {
            expect(e.errorCode).to.equal(6002);
            expect(e.message).to.equal('Service does not exist');
        }

    });
});