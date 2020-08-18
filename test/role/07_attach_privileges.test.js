const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin } = require('../helpers'),
    Role = require('../../v1').Roles,
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('attach privileges to role', () => {
    let attachPrivileges;
    it('fails on malformed token', async () => {
        try {
            nockLogin();
            nock('/roles/1/privileges/attach', 'post', {
                privilege_ids: [1, 2]
            }, 401, {
                message: 'UNAUTHORIZED', errorCode: 3001
            });
            await new Role().setToken('some token').attachPrivileges(
                1,
                [1, 2]
            );
            throw 'it will not pass because the token is invalid';
        } catch (e) {
            expect(e.message).to.equal('UNAUTHORIZED');
            expect(e.errorCode).to.equal(3001);
        }
    });
    it('attaches privileges to a role', async () => {
        nockLogin();
        nock('/roles/1/privileges/attach', 'post', {
            privilege_ids: [1, 2]
        }, 201, {
            response: {
                message: 'Privileges attached successfully'
            }
        });
        attachPrivileges = await new Role().withAuth().attachPrivileges(1, [1, 2]);
        expect(attachPrivileges).to.be.instanceOf(Object).and.has.property('message');
    });
    it('fails when privileges are not an array', async () => {
        try {
            nockLogin();
            nock('/roles/1/privileges/attach', 'post', {
                privilege_ids: 1
            }, 422, {
                message: { privileges: '"privileges" must be an array' }
            });
            await new Role().withAuth().attachPrivileges(1, 1);
            throw 'should not reach this line, privileges are not an array';
        } catch (e) {
            expect(e.message.privileges).to.equal('"privileges" must be an array');
        }
    });

});