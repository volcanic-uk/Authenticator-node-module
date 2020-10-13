const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin } = require('../helpers'),
    Group = require('../../v1').Group,
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('attach permissions to group', () => {
    let attachPermissions;
    it('fails on malformed token', async () => {
        try {
            nockLogin();
            nock('/groups/1/permissions/attach', 'post', {
                permission_ids: [1, 2]
            }, 401, {
                message: 'UNAUTHORIZED', errorCode: 3001
            });
            await new Group().setToken('some token').attachPermissions(
                1,
                [1, 2]
            );
            throw 'it will not pass because the token is invalid';
        } catch (e) {
            expect(e.message).to.equal('UNAUTHORIZED');
            expect(e.errorCode).to.equal(3001);
        }
    });
    it('attaches permissions to a group', async () => {
        nockLogin();
        nock('/groups/1/permissions/attach', 'post', {
            permission_ids: [1, 2]
        }, 201, {
            response: {
                message: 'Permissions attached successfully'
            }
        });
        attachPermissions = await new Group().withAuth().attachPermissions(1, [1, 2]);
        expect(attachPermissions).to.be.instanceOf(Object).and.has.property('message');
    });
    it('fails when permissions are not an array', async () => {
        try {
            nockLogin();
            nock('/groups/1/permissions/attach', 'post', {
                permission_ids: 1
            }, 422, {
                message: { permission_ids: '"permission_ids" must be an array' }
            });
            await new Group().withAuth().attachPermissions(1, 1);
            throw 'should not reach this line, permissions are not an array';
        } catch (e) {
            expect(e.message.permission_ids).to.equal('"permission_ids" must be an array');
        }
    });

});
