const nock = require('nock');
const expect = require('chai').expect;
const Identity = require('../v1/index').Identity;

describe('the login stuff for now', () => {


    it('should login ', async () => {
        const scope = nock('http://localhost:3003/api/v1')
            .post('/identity/login', {
                name: 'volcanic',
                audience: [],
                secret: 'volcanic!123',
                dataset_id: '-1'
            })
            .reply(200, {
                token: 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjljYjg1YTc3YTllNWU0MTU3ODMyYTFlYTgzOTI3MDZhIn0.eyJleHAiOjE1NzI0OTYzNDIsInN1YiI6InVzZXI6Ly9zYW5kYm94Ly0xLzEvMS8yIiwibmJmIjoxNTcyNDkyNzQyLCJhdWRpZW5jZSI6WyJrcmFrYXRvYWV1IiwiLSJdLCJpYXQiOjE1NzI0OTI3NDIsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.AIIsVxwqsYWg3DqusQhC8qeBbIX22Rk6fZHwY2iNgnU-ghOJDmK9QNMZbqJDul5hqTXfFyB7HVw0SBXjivPtFunDAOytU-JupKTl7qgveRiU0oVMdtrtEI7iSNXS30p2ulEu0bumUjibTEW4oig0K4LJYoNxht_rPosOx_NPqCxp1ljB'
            });
        let za = await new Identity().login('volcanic', 'volcanic!123', [], '-1');
        expect(za).to.be.an('object').that.has.a.property('token');
        scope.isDone();
    });

});