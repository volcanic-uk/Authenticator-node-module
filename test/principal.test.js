const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const expect = chai.expect;
chai.use(chaiAsPromised);
const { createPrincipalAuth, readPrincipalAuth, updatePrincipalAuth, deletePrincipalAuth } = require('../v1/index').principalWithAuth;
const { createNewPrincipal, deletePrincipal, readPrincipal, updatePrincipal } = require('../v1').principal;

require('dotenv').config();

describe('Principals tests', () => {

    let tempPrincipalName = 'Volcanic' + Math.floor(Math.random() * 10000);
    let tempPrincipalId = Math.floor(Math.random() * 10000);
    let id = null;

    // principal creation
    it('should return an error if the Authorization header is missing or token is malformed', async () => {
        try {
            await createNewPrincipal(tempPrincipalName, tempPrincipalId, 'asdasd');
            throw 'can not create principal with malformed or no token';
        } catch (e) {
            expect(e.message).to.be.equal('jwt malformed');
        }
    });

    it('should return an object when the principal is successfully created', async () => {
        let principal = await createPrincipalAuth(tempPrincipalName, tempPrincipalId);
        id = principal.id;
        expect(principal).to.be.instanceOf(Object).and.have.property('dataset_id').that.equals(tempPrincipalId);
    });

    it('should return an error when a duplicate entry occurs', async () => {
        try {
            await createPrincipalAuth(tempPrincipalName, tempPrincipalId);
            throw 'can not craete a duplicate identiy name';
        } catch (e) {
            expect(e.message).equals(`Duplicate entry ${tempPrincipalName}`);
        }
    });

    // reading principal
    it('should return an error if the principal does not exist', async () => {
        try {
            await readPrincipalAuth(tempPrincipalId);
            throw 'can not retrieve a principal that does not exist';
        } catch (e) {
            expect(e.message).equals('Principal does not exist');
        }
    });

    it('should return an error if the request does not have a jwt authorization header', async () => {
        try {
            await readPrincipal(id, 'asddas');
            throw 'can not read principal with malformed or no token';
        } catch (e) {
            expect(e.message).to.be.equals('jwt malformed');
        }
    });

    it('should return an object if the principal is found', async () => {
        expect(readPrincipalAuth(id)).to.be.instanceOf(Object).and.eventually.have.nested.property('dataset_id').that.equals(tempPrincipalId);
    });

    //update principal
    it('should return an error if the header has no auhtorization token or a malformed one', async () => {
        try {
            await updatePrincipal(1, id, 'asdasd');
            throw 'can not read principal with malformed or no token';
        } catch (e) {
            expect(e.message).equals('jwt malformed');
        }
    });

    it('should return an error if the principal does not exist', async () => {
        try {
            await updatePrincipalAuth(1, id+8686896668);
            throw 'principal does not exist';
        } catch (e) {
            expect(e.message).equals('Principal does not exist');
        }
    });

    it('should return an object having the new upfated status of the principal if they exist', async () => {
        expect(updatePrincipalAuth(id)).to.be.instanceOf(Object).and.eventually.have.nested.property('dataset_id').that.equals(tempPrincipalId);
    });

    // delete principal
    it('should return an error if the principal does not exist', async () => {
        try {
            await deletePrincipalAuth(id+868689666813144);
            throw 'principal requested does not exist';
        } catch (e) {
            expect(e.message).equals('Principal does not exist');
        }
    });

    it('should return an error if the request header has no token or it is malformed', async () => {
        try {
            await deletePrincipal(id, 'asdasdasdasdsa');
            throw 'principal requested does not exist';
        } catch (e) {
            expect(e.message).equals('jwt malformed');
        }
    });

    it('should return a message type of string sayng that the princiap is gone if they exist', async () => {
        expect(deletePrincipalAuth(id)).to.be.instanceOf(Object).and.eventually.have.property('message', 'Successfully deleted');
    });

});