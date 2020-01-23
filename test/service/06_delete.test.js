const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin } = require('../helpers'),
    Service = require('../../v1').Service,
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('delete a service', async () => {
    it('should delete a service', async () => {
        nockLogin();
        nock('/services/7', 'delete', {}, 200, {
            response: {
                message: 'Successfully deleted'
            }
        });
        let deleteService = await new Service().withAuth().delete(7);
        expect(deleteService.message).to.exist;
    });
    it('should not delete a service if it is already deleted', async () => {
        try {
            nockLogin();
            nock('/services/7', 'delete', {}, 200, {
                message: 'Service already deleted', errorCode: 6002
            });
            await new Service().withAuth().delete(7);
        } catch (e) {
            expect(e.errorCode).to.equal(6002);
            expect(e).to.exist;
        }
    });
});