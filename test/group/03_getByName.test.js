const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin } = require('../../src/helpers'),
    Group = require('../../v1').Group,
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('get group by name', () => {
    it('gets a group by its name', async () => {
        nockLogin();

        nock('/groups/identities_all', 'get', {}, 200, {
            requestID: 'offline_awsRequestId_6071133808761842',
            response: {
                name: 'identities_all',
                id: 1,
                description: null,
                subject_id: null,
                active: true,
                created_at: '2019-11-04T01:38:10.306Z',
                updated_at: '2019-11-04T01:38:10.306Z'
            }
        });

        let read = await new Group().withAuth().getByName('identities_all');
        expect(read).to.be.instanceOf(Object).and.have.property('id');

    });

    it('fails when the name doesnt exist', async () => {
        try {
            nockLogin();
            nock('/groups/1testing', 'get', {}, 404, {
                requestID: 'offline_awsRequestId_4213248638586029',
                message: 'Group does not exist',
                errorCode: 4001
            });
            await new Group().withAuth().getByName('1testing');
            throw 'should not read this line because the id is not valid';
        } catch (e) {
            expect(e.message).equals('Group does not exist');
        }
    });
});