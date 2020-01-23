const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    expect = chai.expect,
    { nock, nockLogin } = require('../helpers'),
    Principal = require('../../v1').Principal;
chai.use(chaiAsPromised);

describe('principal create test', () => {
    let principal = new Principal();
    nockLogin();
    it('should fail if principal creation function is called without a valid token and it will throw an error', async () => {
        try {
            nock('/principals', 'post', {
                name: 'principal-test',
                dataset_id: 111
            }, 403, {
                message: 'Forbidden',
                errorCode: 3001
            });
            await principal.create('principal-test', 111);
            throw 'can not create principal with malformed or no token';
        } catch (e) {
            expect(e.message).to.be.equal('Forbidden');
        }
    });

    it('should be a success when passing valid data, hence it will return an object carrying the created principal data', async () => {
        nockLogin();
        nock('/principals', 'post', {
            name: 'principal_tests',
            dataset_id: '111'
        }, 201, {
            response: {
                name: 'p************t',
                dataset_id: '111',
                secure_id: '334e5b1dd2',
                updated_at: '2019-10-31T04:33:06.089Z',
                created_at: '2019-10-31T04:33:06.089Z',
                id: 2
            }
        });
        let create = await principal.withAuth().create('principal_tests', '111');
        expect(create).to.be.instanceOf(Object).and.have.property('dataset_id').that.equals('111');
    });

    it('should not create a principal and it will throw an error if the name already exist', async () => {
        try {
            nockLogin();
            nock('/principals', 'post', {
                name: 'principal_tests',
                dataset_id: '111'
            }, 400, {
                message: 'Duplicate entry principal-tests on dataset id 111',
                errorCode: 2001
            });
            await principal.withAuth().create('principal_tests', '111');
            throw 'should not reach this line, as the name is duplicated';
        } catch (e) {
            expect(e.message).to.exist;
            expect(e.errorCode).to.equal(2001);
        }
    });
});