const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin } = require('../helpers'),
    Service = require('../../v1').Service,
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('should read created service', async () => {

    it('should read a service', async () => {
        nockLogin();
        nock('/services/7', 'get', {}, 200, {
            response: {
                id: 1,
                name: 'a**h',
                active: true,
                subject_id: null,
                created_at: '2019-10-31T09:33:20.217Z',
                updated_at: '2019-10-31T09:33:20.217Z'
            }
        });
        let serviceRead = await new Service().withAuth().getByID(7);
        expect(serviceRead.id).to.exist;
    });
    it('should not read service with wrong id', async () => {
        try {
            nockLogin();
            nock('/services/65758', 'get', {}, 404, {
                message: 'Service does not exist', errorCode: 6002
            });
            await new Service().withAuth().getByID(65758);
        } catch (e) {
            expect(e.errorCode).to.equal(6002);
            expect(e.message).to.equal('Service does not exist');
        }
    });

});