const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin } = require('../../src/helpers/test_helpers'),
    Privilege = require('../../v1').Privilege,
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('delete privileges', () => {
    it('fails deleting a non existing id', async () => {
        try {
            nock('/privileges/432434', 'delete', {}, 400, {
                message: 'Privilege does not exist', errorCode: 8001
            });
            nockLogin();
            await new Privilege().withAuth().delete(432434);
            throw 'must not reach this line, the id is invalid';
        } catch (e) {
            expect(e.message).to.equal('Privilege does not exist');
            expect(e.errorCode).to.equal(8001);
        }
    });

    it('deletes the provided privilege', async () => {
        nock('/privileges/15', 'delete', {}, 200, {
            response: {
                message: 'Successfully deleted privilege'
            }
        });
        nockLogin();
        let deletePriv = await new Privilege().withAuth().delete(15);
        expect(deletePriv.message).to.exist;
    });
});