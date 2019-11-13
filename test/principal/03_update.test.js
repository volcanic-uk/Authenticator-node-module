const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin } = require('../../src/helpers'),
    Principal = require('../../v1').Principal,
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('Principal updates', async () => {
    let principal = new Principal();
    //update principal
    it('upon principal update, the request should not be completed if there is no authorization token in the request header, and it will throw an error', async () => {
        try {
            nockLogin();
            let scope = nock('/principals/334e5b1dd2', 'post', { name: 'new name', }, 403, {
                message: 'Forbidden', errorCode: 3001
            });
            await new Principal().update('334e5b1dd2', 'new name');
            scope.done();
            throw 'should not read this line because the update request has no token, or it is malformed';
        } catch (e) {
            expect(e.message).to.equal('Forbidden');
            expect(e.errorCode).to.equal(3001);
        }
    });

    it('should not update a principal that does not exist hence an error is thrown', async () => {
        try {
            nockLogin();
            let scope = nock('/principals/12', 'post', { name: 'new name', }, 404, {
                message: 'Principal does not exist', errorCode: 2002
            });
            await principal.withAuth().update(12, 'new name');
            scope.done();
            throw 'should not reach this line because the principal requested does not exist';
        } catch (e) {
            expect(e.errorCode).to.equal(2002);
            expect(e.message).to.equal('Principal does not exist');
        }
    });

    it('should be a success when the principal is updated, thus it will return an object carrying the new attributes for the principal', async () => {
        nockLogin();
        nock('/principals/8efa33dbf0', 'post', { name: 'new name', }, 200, {
            response: {
                id: '334e5b1dd2',
                name: 'n******e',
                dataset_id: '111',
                last_active_date: null,
                login_attempts: 0,
                active: true,
                created_at: '2019-10-31T04:33:06.089Z',
                updated_at: '2019-10-31T08:36:16.906Z'
            }
        });
        let update = await principal.withAuth().update('8efa33dbf0', 'new name');
        expect(update.dataset_id).to.exist;
    });
});
