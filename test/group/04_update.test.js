const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    Group = require('../../v1').Group,
    { nock, nockLogin } = require('../helpers'),
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('group update', () => {

    it('it updates the specified group info', async () => {
        nockLogin();
        nock('/groups/15', 'post', {
            name: 'group-test-3', description: 'test group for module'
        }, 200, {
            requestID: 'offline_awsRequestId_33457864888791766',
            response: {
                id: '16',
                name: 'g**********3',
                description: 'test group for module',
                subject_id: null,
                active: true,
                created_at: '2019-11-04T05:51:57.822Z',
                updated_at: '2019-11-04T08:34:26.138Z'
            }
        });

        let update = await new Group().withAuth().update(15, 'group-test-3', 'test group for module');
        expect(update).to.be.instanceOf(Object).and.have.property('id');
    });

    it('fails when passing an invalid id', async () => {
        nockLogin();
        nock('/groups/49384', 'post', {
            name: 'group-test', description: 'test group for module'
        }, 404, {
            requestID: 'offline_awsRequestId_4486227769442046',
            message: 'Permission group does not exist',
            errorCode: 4001

        });
        try {
            await new Group().withAuth().update(49384, 'group-test', 'test group for module');
            throw 'should not read this line, because the id is not valid';
        } catch (e) {
            expect(e.message).equals('Permission group does not exist');
        }
    });

});