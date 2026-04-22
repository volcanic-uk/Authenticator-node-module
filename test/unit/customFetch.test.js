const chai = require('chai'),
    expect = chai.expect;

const Nock = require('nock');
const ModuleConfig = require('../../config');

// Set config for tests
ModuleConfig.server.set({
    domainName: 'http://localhost:3003',
    stack_id: 'local'
});

const { customFetch } = require('../../src/helpers');

describe('customFetch', () => {

    afterEach(() => {
        Nock.cleanAll();
    });

    it('should not include data property in request config for GET requests with data=null', async () => {
        const scope = Nock('http://localhost:3003')
            .get('/api/v1/test-endpoint')
            .reply(200, { response: { result: 'ok' } });

        const result = await customFetch('get', '/api/v1/test-endpoint', {}, null);
        expect(result).to.deep.include({ response: { result: 'ok' } });
        scope.done();
    });

    it('should not include data property in request config for GET requests with no data argument', async () => {
        const scope = Nock('http://localhost:3003')
            .get('/api/v1/test-endpoint')
            .reply(200, { response: { result: 'ok' } });

        const result = await customFetch('get', '/api/v1/test-endpoint', {});
        expect(result).to.deep.include({ response: { result: 'ok' } });
        scope.done();
    });

    it('should include data property in request config for POST requests', async () => {
        const postData = { name: 'test', secret: 'test123' };
        const scope = Nock('http://localhost:3003')
            .post('/api/v1/test-endpoint', postData)
            .reply(200, { response: { token: 'abc123' } });

        const result = await customFetch('post', '/api/v1/test-endpoint', {}, postData);
        expect(result).to.deep.include({ response: { token: 'abc123' } });
        scope.done();
    });

    it('should include data property in request config for PUT requests', async () => {
        const putData = { name: 'updated' };
        const scope = Nock('http://localhost:3003')
            .put('/api/v1/test-endpoint', putData)
            .reply(200, { response: { status: 'updated' } });

        const result = await customFetch('put', '/api/v1/test-endpoint', {}, putData);
        expect(result).to.deep.include({ response: { status: 'updated' } });
        scope.done();
    });

    it('should not include data property for DELETE requests with data=null', async () => {
        const scope = Nock('http://localhost:3003')
            .delete('/api/v1/test-endpoint')
            .reply(200, { response: { deleted: true } });

        const result = await customFetch('delete', '/api/v1/test-endpoint', {}, null);
        expect(result).to.deep.include({ response: { deleted: true } });
        scope.done();
    });

    it('should pass headers correctly', async () => {
        const scope = Nock('http://localhost:3003', {
            reqheaders: {
                'Authorization': 'Bearer test-token'
            }
        })
            .get('/api/v1/test-endpoint')
            .reply(200, { response: { result: 'ok' } });

        const result = await customFetch('get', '/api/v1/test-endpoint', { 'Authorization': 'Bearer test-token' });
        expect(result).to.deep.include({ response: { result: 'ok' } });
        scope.done();
    });

    it('should throw on HTTP errors', async () => {
        Nock('http://localhost:3003')
            .get('/api/v1/test-endpoint')
            .reply(400, { message: 'Bad Request' });

        try {
            await customFetch('get', '/api/v1/test-endpoint', {});
            expect.fail('should have thrown');
        } catch (e) {
            expect(e.response.status).to.equal(400);
        }
    });
});
