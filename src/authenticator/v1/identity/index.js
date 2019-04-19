const fetchAPI = require('../helpers/index');
let token = `Bearer eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTYzNTI5MTYsImlhdCI6MTU1NTQ4ODkxNiwiaXNzIjoiVm9sY2FuaWMgYmV0dGVyIHBlb3BsZSB0ZWNobm9sb2d5IiwianRpIjoiZWViNmIwMjAtNjBlOC0xMWU5LTgzNDUtYmYzMWEwY2E5OWM4In0.Ac8ZW_Prt6fRPbxc9vzzIOxTvKrsQ7xsIo8mHhDXYxUPQ1LNMq3qCATOjM9Fm1-vQG_ts4Akjq66W9ysIg_sDOMSAAThAHPz3tp6b8arNVZq0N7Kqd1MgODRs7n0dwgay113ayz6AYQYsSiqlA6RoaT1trOOzQjs9q8mLlV93riX6cXm`;

fetchAPI.customFetch("post", 'http://localhost:3000/api/v1/identity/login', null, {
	"name": "testt",
    "secret": "123456789"
});

