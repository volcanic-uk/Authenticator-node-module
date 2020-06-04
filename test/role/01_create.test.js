const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin } = require('../helpers'),
    Role = require('../../v1').Roles,
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('role creates', () => {
    let createRole;
    it('fails on malformed token', async () => {
        try {
            nockLogin();
            nock('/roles', 'post', {
                name: 'role-test', privileges: [1, 2]
            }, 401, {
                message: 'UNAUTHORIZED', errorCode: 3001
            });
            await new Role().setToken('some token').create('role-test', [1, 2]);
            throw 'it will not pass because the token is invalid';
        } catch (e) {
            expect(e.message).to.equal('UNAUTHORIZED');
            expect(e.errorCode).to.equal(3001);
        }
    });
    it('creates a new role', async () => {
        nockLogin();
        nock('/roles', 'post', {
            name: 'role-test', privileges: [1, 2]
        }, 201, {
            response: {
                name: 'role_test',
                subject_id: '2',
                updated_at: '2019-11-01T03:53:46.332Z',
                created_at: '2019-11-01T03:53:46.332Z',
                id: 7
            }
        });
        createRole = await new Role().withAuth().create('role-test', [1, 2]);
        expect(createRole).to.be.instanceOf(Object).and.has.property('id');
    });
    it('creates a new role with principal id', async () => {
        nockLogin();
        nock('/roles', 'post', {
            name: 'role-test', privileges: [1, 2], parent_id: createRole.id
        }, 201, {
            response: {
                name: 'Role-159125678',
                subject_id: null,
                parent_id: createRole.id,
                updated_at: '2020-06-04T07:46:23.390Z',
                created_at: '2020-06-04T07:46:23.390Z',
                id: 8
            }
        });
        createRole = await new Role().withAuth().create('role-test', [1, 2], createRole.id);
        expect(createRole).to.be.instanceOf(Object).and.has.property('id');
        expect(createRole).to.be.instanceOf(Object).and.has.property('parent_id');
    });

    it('fails when privileges are not an array', async () => {
        try {
            nockLogin();
            nock('/roles', 'post', {
                name: 'role-tests', privileges: 1
            }, 422, {
                message: { privileges: '"privileges" must be an array' }
            });
            await new Role().withAuth().create('role-tests', 1);
            throw 'should not reach this line, privileges are not an array';
        } catch (e) {
            expect(e.message.privileges).to.equal('"privileges" must be an array');
        }
    });
});