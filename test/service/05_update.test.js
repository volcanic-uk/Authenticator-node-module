const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin } = require('../helpers'),
    Service = require('../../v1').Service,
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('update a service', async () => {

    it('should update a service', async () => {
        nockLogin();
        nock('/services/7', 'post', {
            name: 'updated_service_name'
        }, 200, {
            response: {
                id: 7,
                name: 'u******************e',
                active: true,
                subject_id: 2,
                created_at: '2019-11-01T06:39:30.615Z',
                updated_at: '2019-11-01T07:16:45.877Z'
            }
        });
        let updateService = await new Service().withAuth().update(7, 'updated_service_name');
        expect(updateService).to.be.an('object').that.has.property('name');
    });
    it('should not update a non-exist service', async () => {
        try {
            nockLogin();
            nock('/services/8773', 'post', {
                name: 'updated_service_name'
            }, 404, {
                message: 'Service does not exist', errorCode: 6002
            });
            await new Service().withAuth().update(8773, 'updated_service_name');
        } catch (e) {
            expect(e.errorCode).to.equal(6002);
            expect(e.message).to.equal('Service does not exist');
        }
    });
});