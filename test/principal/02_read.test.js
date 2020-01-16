const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    expect = chai.expect,
    Principal = require('../../v1').Principal,
    { nock, nockLogin } = require('../../src/helpers/test_helpers');
chai.use(chaiAsPromised);

describe('Principal read', () => {
    let principal = new Principal();
    // reading principal
    it('should not proceed if the principal does not exist upon read request, and it will throw an error', async () => {
        try {
            nockLogin();
            let scope = nock('/principals/12', 'get', {}, 404, {
                message: 'Principal does not exist',
                errorCode: 2002
            });
            await principal.withAuth().getByID(12);
            scope.done();
            throw 'can not retrieve a principal that does not exist';
        } catch (e) {
            expect(e.message).equals('Principal does not exist');
        }
    });

    it('should fail when requesting a read request when there is no token in the request header, and it will throw an error', async () => {
        try {
            let scope = nock('/principals/asdasd', 'get', {}, 403, {
                statusCode: 403,
                status: false,
                message: 'Forbidden',
                errorCode: 3001
            });
            await new Principal().getByID('asdasd');
            scope.done();
            throw 'should not reach this line, because the read request has no token, or it is malformed';
        } catch (e) {
            expect(e.message).to.be.equals('Forbidden');
            expect(e.errorCode).to.be.equals(3001);
        }
    });

    it('should return an object if the principal is found successfully while passing valid data', async () => {
        nockLogin();
        nock('/principals/volcanic', 'get', {}, 200, {
            response: {
                secure_id: 'volcanic',
                id: 1,
                name: 'volcanic-principal',
                dataset_id: '-1',
                last_active_date: null,
                login_attempts: 0,
                active: true,
                created_at: '2019-10-31T04:32:57.678Z',
                updated_at: '2019-10-31T04:32:57.678Z',
                status: true
            }
        });
        let read = await principal.withAuth().getByID('volcanic');
        expect(read.id).to.exist;
    });
});