const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin } = require('../helpers'),
    Service = require('../../v1').Service,
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('create service', () => {

    it('should create a service', async () => {
        nockLogin();
        nock('/services', 'post', {
            name: 'service_for_test'
        }, 201, {
            response: {
                name: 's**************t',
                subject_id: '2',
                updated_at: '2019-11-01T06:39:30.615Z',
                created_at: '2019-11-01T06:39:30.615Z',
                id: 7
            }
        });
        let create = await new Service().withAuth().create('service_for_test');
        expect(create).to.be.an('object').that.has.property('id');
    });

    it('should not create duplicated service', async () => {
        try {
            nockLogin();
            nock('/services', 'post', {
                name: 'service_for_test'
            }, 400, {
                message: 'Duplicate entry service_for_test', errorCode: 6001
            });
            await new Service().withAuth().create('service_for_test');
            throw 'should not reach this line cuz the service is already there';
        } catch (e) {
            expect(e.errorCode).to.equal(6001);
            expect(e.message).to.equal('Duplicate entry service_for_test');
        }
    });

    it('should not create service without name', async () => {
        try {
            nockLogin();
            nock('/services', 'post', {
                name: null
            }, 400, {
                message: { name: '"*********************g' },
                errorCode: 10001
            });
            await new Service().withAuth().create(null);
            throw 'should not reach this line cuz the name is null';
        } catch (e) {
            expect(e.errorCode).to.equal(10001);
            expect(e.message).to.exist;
        }
    });

});