const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin } = require('../helpers'),
    Group = require('../../v1').Group,
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('Group create', () => {

    it('should create a new group', async () => {
        nockLogin();
        nock('/groups', 'post', {
            name: 'group_testing',
            permissions: [],
            description: 'test group for module'
        }, 201, {
            requestID: 'offline_awsRequestId_8442325613994397',
            response: {
                name: 'g********t',
                description: 'test group for module',
                updated_at: '2019-10-31T07:27:15.142Z',
                created_at: '2019-10-31T07:27:15.142Z',
                id: 15
            },
            status: 201
        });
        let create = await new Group().withAuth().create({
            name: 'group_testing',
            permissions: [],
            description: 'test group for module'
        });
        expect(create).to.be.instanceOf(Object).and.have.property('id');

    });

    it('fails upon duplicate entry', async () => {
        try {
            nockLogin();
            nock('/groups', 'post', {
                name: 'group_testing',
                permissions: [],
                description: 'test group for module'
            }, 400, {
                requestID: 'offline_awsRequestId_2116179236304796',
                message: 'Duplicate entry group_testing',
                errorCode: 4002
            });
            await new Group().withAuth().create({
                name: 'group_testing',
                permissions: [],
                description: 'test group for module'
            });
            throw 'should not reach this line because the group name already exists';
        } catch (e) {
            expect(e.message).equals('Duplicate entry group_testing');
        }
    });
});