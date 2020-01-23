const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    expect = chai.expect,
    Privilege = require('../../v1/index').Privilege,
    { nock, nockLogin } = require('../helpers');
chai.use(chaiAsPromised);

// create privileges
describe('creates privilege', () => {
    it('fails when the token is invalid', async () => {
        try {
            nock('/privileges', 'post', {
                scope: 'vrn:{stack}:{dataset}:jobs/*',
                permission_id: 1,
                group_id: 1,
                allow: true
            }, 403, {
                message: 'Forbidden', errorCode: 3001
            });
            await new Privilege().setToken('sometoken').create('vrn:{stack}:{dataset}:jobs/*', 1, 1, true);
            throw 'must not reach this line because the token is invalid';
        } catch (e) {
            expect(e.message).to.equal('Forbidden');
            expect(e.errorCode).to.equal(3001);
        }
    });
    it('creates a new privilege', async () => {
        nockLogin();
        nock('/privileges', 'post', {
            scope: 'vrn:{stack}:{dataset}:jobs/*',
            permission_id: 1,
            group_id: 1,
            allow: true
        }, 201, {
            response: {
                scope: 'vrn:{stack}:{dataset}:jobs/*',
                permission_id: 1,
                group_id: 1,
                subject_id: '2',
                allow: true,
                updated_at: '2019-11-01T01:56:12.001Z',
                created_at: '2019-11-01T01:56:12.001Z',
                id: 15
            }
        });
        let create = await new Privilege().withAuth().create('vrn:{stack}:{dataset}:jobs/*', 1, 1, true);
        expect(create).to.be.an.instanceOf(Object).and.have.property('group_id');
    });
    it('creates a new privilege', async () => {
        nockLogin();
        nock('/privileges', 'post', {
            scope: 'vrn:{stack}:{dataset}:jobs/*',
            permission_id: 1,
            group_id: 1,
            allow: true
        }, 201, {
            response: {
                scope: 'vrn:{stack}:{dataset}:jobs/*',
                permission_id: 1,
                group_id: 1,
                subject_id: '2',
                allow: true,
                updated_at: '2019-11-01T01:56:12.001Z',
                created_at: '2019-11-01T01:56:12.001Z',
                id: 16
            }
        });
        let create = await new Privilege().withAuth().create('vrn:{stack}:{dataset}:jobs/*', 1, 1, true);
        expect(create).to.be.an.instanceOf(Object).and.have.property('group_id');
    });
});


