const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    expect = chai.expect,
    Privilege = require('../../v1/index').Privilege,
    timeStamp = Math.floor(Date.now() / 1000),
    { nock, nockLogin } = require('../helpers');
chai.use(chaiAsPromised);

// create privileges
describe('creates privilege', () => {
    it('fails when the token is invalid', async () => {
        try {
            nock('/privileges', 'post', {
                scope: `vrn:{stack}:{dataset}:jobs/${timeStamp}`,
                permission_id: 1,
                group_id: 1,
                allow: true,
                tag:'privilege-tag'
            }, 401, {
                message: 'UNAUTHORIZED', errorCode: 3001
            });
            await new Privilege().setToken('sometoken').create({
                scope: `vrn:{stack}:{dataset}:jobs/${timeStamp}`,
                permission_id: 1,
                group_id: 1,
                allow: true,
                tag:'privilege-tag'
            });
            throw 'must not reach this line because the token is invalid';
        } catch (e) {
            expect(e.message).to.equal('UNAUTHORIZED');
            expect(e.errorCode).to.equal(3001);
        }
    });
    it('creates a new privilege', async () => {
        nockLogin();
        nock('/privileges', 'post', {
            scope: `vrn:{stack}:{dataset}:jobs/${timeStamp + 1}`,
            permission_id: 1,
            group_id: 1,
            allow: true,
            tag:'privilege-tag'
        }, 201, {
            response: {
                scope: `vrn:{stack}:{dataset}:jobs/${timeStamp + 1}`,
                permission_id: 1,
                group_id: 1,
                subject_id: '2',
                tag:'privilege-tag',
                allow: true,
                updated_at: '2019-11-01T01:56:12.001Z',
                created_at: '2019-11-01T01:56:12.001Z',
                id: 15
            }
        });
        let create = await new Privilege().withAuth().create({
            scope: `vrn:{stack}:{dataset}:jobs/${timeStamp + 1}`,
            permission_id: 1,
            group_id: 1,
            allow: true,
            tag:'privilege-tag'
        });
        expect(create).to.be.an.instanceOf(Object).and.have.property('group_id');
    });
    it('creates a new privilege', async () => {
        nockLogin();
        nock('/privileges', 'post', {
            scope: `vrn:{stack}:{dataset}:jobs/${timeStamp + 2}`,
            permission_id: 1,
            group_id: 1,
            allow: true,
            tag:'privilege-tag'
        }, 201, {
            response: {
                scope: `vrn:{stack}:{dataset}:jobs/${timeStamp + 2}`,
                permission_id: 1,
                group_id: 1,
                subject_id: '2',
                tag:'privilege-tag',
                allow: true,
                updated_at: '2019-11-01T01:56:12.001Z',
                created_at: '2019-11-01T01:56:12.001Z',
                id: 16
            }
        });
        let create = await new Privilege().withAuth().create({
            scope: `vrn:{stack}:{dataset}:jobs/${timeStamp + 2}`,
            permission_id: 1,
            group_id: 1,
            allow: true,
            tag:'privilege-tag'
        });
        expect(create).to.be.an.instanceOf(Object).and.have.property('group_id');
    });
});


