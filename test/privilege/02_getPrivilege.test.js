const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin } = require('../../src/helpers/test_helpers'),
    Privilege = require('../../v1').Privilege,
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('get privileges', () => {
    it('gets the new privilege', async () => {
        nock('/privileges/2', 'get', {}, 200, {
            response: {
                id: 2,
                scope: 'vrn:{stack}:{dataset}:principal/*',
                permission_id: null,
                group_id: 2,
                allow: true,
                subject_id: null,
                created_at: '2019-10-31T09:33:20.461Z',
                updated_at: '2019-10-31T09:33:20.461Z'
            }
        });
        nockLogin();
        let read = await new Privilege().withAuth().getById(2);
        expect(read).to.be.an.instanceOf(Object).and.have.property('group_id');
    });

    it('fails with non existing id', async () => {
        try {
            nock('/privileges/12324', 'get', {}, 404, {
                message: 'privilege does not exist', errorCode: 8001
            });
            nockLogin();
            await new Privilege().withAuth().getById(12324);
            throw 'should not reach this line because privilege does not exist';
        } catch (e) {
            expect(e.message).to.equal('privilege does not exist');
            expect(e.errorCode).to.equal(8001);
        }
    });

});