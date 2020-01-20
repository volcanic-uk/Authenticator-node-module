const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin } = require('../helpers'),
    Group = require('../../v1').Group,
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('Group get by id', () => {
    // read a group by id
    it('should get the specified group', async () => {
        nockLogin();
        nock('/groups/1', 'get', {}, 201, {
            response: {
                id: 1,
                name: 'i************l',
                description: null,
                subject_id: null,
                active: true,
                created_at: '2019-10-31T08:01:30.102Z',
                updated_at: '2019-10-31T08:01:30.102Z'
            }
        });
        let read = await new Group().withAuth().getById(1);
        expect(read).to.be.instanceOf(Object).and.have.property('id');
    });
    it('fails upon fetching a non existing id', async () => {
        try {
            nockLogin();
            nock('/groups/1testing', 'get', {}, 404, {
                requestID: 'offline_awsRequestId_5549612898225689',
                message: 'Group does not exist',
                errorCode: 4001

            });
            await new Group().withAuth().getById(1 + 'testing');
            throw 'should not read this line because the id is not valid';
        } catch (e) {
            expect(e.message).equals('Group does not exist');
        }
    });
});