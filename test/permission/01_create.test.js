const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    Permission = require('../../v1').Permission,
    { nock, nockLogin } = require('../helpers'),
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('create permission', async () => {
    it('should create a permission', async () => {
        nockLogin();
        nock('/permissions', 'post', {
            name: 'new_permission_test',
            service_id: 2,
            description: 'this is a new permission test'
        }, 201, {
            response: {
                name: 'n****************1',
                service_id: 2,
                description: 'this is new permission',
                subject_id: '2',
                updated_at: '2019-11-04T01:43:33.854Z',
                created_at: '2019-11-04T01:43:33.854Z',
                id: 64
            }
        });
        await new Permission().withAuth().create({
            name: 'new_permission_test',
            description: 'this is a new permission test',
            service_id: 2
        });
    });
    it('should not create duplicated permission', async () => {
        try {
            nockLogin();
            nock('/permissions', 'post', {
                name: 'new_permission_test',
                service_id: 2,
                description: 'this is a new permission test'
            }, 400, {
                message: 'Duplicate entry new_permission_test',
                errorCode: 5003
            });
            await new Permission().withAuth().create({
                name: 'new_permission_test',
                description: 'this is a new permission test',
                service_id: 2
            });
        } catch (e) {
            expect(e.errorCode).to.equal(5003);
            expect(e).to.exist;
        }
    });
    it('should not create permission without name', async () => {
        try {
            nockLogin();
            nock('/permissions', 'post', {
                name: null,
                description: ''
            }, 422, {
                message: {
                    name: '"*********************g',
                    service_id: '"service_id" is required'
                },
                errorCode: 10001
            });
            await new Permission().withAuth().create({ name: null });
        } catch (e) {
            expect(e.errorCode).to.equal(10001);
            expect(e).to.exist;
        }
    })
    ;
})
;