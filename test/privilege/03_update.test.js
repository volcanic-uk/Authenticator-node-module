const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin } = require('../helpers'),
    Privilege = require('../../v1').Privilege,
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('Update privileges', () => {
    it('fails updating a non existing ID', async () => {
        try {
            nock('/privileges/123412', 'post', {
                permission_id: 1,
                group_id: 1,
                scope: 'vrn:{stack}:{dataset}:jobs/*',
                allow: true,
                tag: 'privilege-tag'
            }, 404, {
                message: 'Privilege does not exist', errorCode: 8001
            });
            nockLogin();
            await new Privilege().withAuth().update({
                id: 123412,
                scope: 'vrn:{stack}:{dataset}:jobs/*',
                permission_id: 1,
                group_id: 1,
                allow: true,
                tag: 'privilege-tag'
            });
            throw 'should not reach this line, because the id doesnt exist';
        } catch (e) {
            expect(e.message).to.equal('Privilege does not exist');
            expect(e.errorCode).to.equal(8001);
        }
    });

    it('updates the specified privilege', async () => {
        nock('/privileges/4', 'post', {
            permission_id: 1,
            group_id: 1,
            scope: 'vrn:{stack}:{dataset}:jobs/*',
            allow: true,
            tag: 'privilege-tag-update'
        }, 200, {
            response: {
                id: 4,
                scope: 'vrn:{stack}:{dataset}:jobs/*',
                permission_id: 1,
                group_id: 1,
                allow: true,
                tag: 'privilege-tag',
                subject_id: null,
                created_at: '2019-10-31T09:33:20.570Z',
                updated_at: '2019-11-01T03:14:25.349Z'
            }
        });
        nockLogin();
        let update = await new Privilege().withAuth().update({
            id: 4,
            scope: 'vrn:{stack}:{dataset}:jobs/*',
            permission_id: 1,
            group_id: 1,
            allow: true,
            tag: 'privilege-tag-update'
        });
        expect(update).to.be.an.instanceOf(Object).and.have.property('group_id');
    });
});