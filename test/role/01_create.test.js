const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin } = require('../helpers'),
    Role = require('../../v1').Roles,
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('role creates', () => {
    it('fails on malformed token', async () => {
        try {
            nockLogin();
            nock('/roles', 'post', {
                name: 'role-test', service_id: 2, privileges: [1, 2]
            }, 403, {
                message: 'Forbidden', errorCode: 3001
            });
            await new Role().setToken('some token').create('role-test', 2, [1, 2]);
            throw 'it will not pass because the token is invalid';
        } catch (e) {
            expect(e.message).to.equal('Forbidden');
            expect(e.errorCode).to.equal(3001);
        }
    });
    it('creates a new role', async () => {
        nockLogin();
        nock('/roles', 'post', {
            name: 'role-test', service_id: 2, privileges: [1, 2]
        }, 201, {
            response: {
                name: 'r*******t',
                subject_id: '2',
                service_id: 2,
                updated_at: '2019-11-01T03:53:46.332Z',
                created_at: '2019-11-01T03:53:46.332Z',
                id: 7
            }
        });
        let create = await new Role().withAuth().create('role-test', 2, [1, 2]);
        expect(create).to.be.instanceOf(Object).and.has.property('id');
    });
    it('fails when privileges are not an array', async () => {
        try {
            nockLogin();
            nock('/roles', 'post', {
                name: 'role-tests', service_id: 2, privileges: 1
            }, 422, {
                message: { privileges: '"privileges" must be an array' }
            });
            await new Role().withAuth().create('role-tests', 2, 1);
            throw 'should not reach this line, privileges are not an array';
        } catch (e) {
            expect(e.message.privileges).to.equal('"privileges" must be an array');
        }
    });
});