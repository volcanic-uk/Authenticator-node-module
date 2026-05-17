### Identity

#### login 
```javascript
  const auth = require('auth-node-module/v1');
  let login = new auth.Identity().login('username'[string], 'password'[string], ['audience'][array], 'exp-date'[date]);
  
  response: {token: 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6ImE1ZjUzZmEyNWYyZjgyYTM4NDNjNGFmMTFiZDgwMWExIn0.eyJleHAiOjE1NjkwMDUzNTgsInN1YiI6InVzZXI6Ly9zYW5kYm94Ly0xLzEvMS8yIiwibmJmIjoxNTY4Nzg5MzU4LCJhdWRpZW5jZSI6WyJrcmF0YWthbyJdLCJpYXQiOjE1Njg3ODkzNTgsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.AXFEi1ogRN_BENdkdGYorh3Zku5Z0WZWvhkES_6ZkPUs0izbPJWVLcn4v9OUSYiFxcOAaGlAoZyJcL0Q11g11GcZAKdXkqkRmOKGdfHuw4-mqRG8zSscJfK4mvhq1egSkLeS7NmPKaumPnP0BPpfI8JD3dXknkCGB_AA-1p4wRykJKle'
}
```

#### create new identity
```javascript
let create = new auth.Identity().setToken(token).create('username'[string], 'secret'[string], 'principalId'[integer]);

response: {
  name: 'identity-1568792822',
  principal_id: 186,
  secret: 'f945129e13a9de6b0fb35de640a065708656630d',
  updated_at: '2019-09-18T07:47:06.715Z',
  created_at: '2019-09-18T07:47:06.715Z',
  id: 1327,
  status: true
}
}
````
#### update identity by id
```javascript
await new auth.Identity().setToken(token).update('username'[string], 'id'[integer]);
response: {
  id: 1332,
  principal_id: 187,
  name: 'updated-name-1568793394',
  last_active_date: null,
  last_used_ip_address: null,
  active: true,
  created_at: '2019-09-18T07:56:37.748Z',
  updated_at: '2019-09-18T07:56:40.735Z',
  status: true
}
```

#### reset secret for identity
```javascript
await new auth.Identity().setToken(token).resetSecret('secret'[string], id[integer]);

response:  { message: 'Secret regenerated successfully', status: true }
```
#### deactivate an identity
```javascript
await new auth.Identity().setToken(token).deactiveIdentity('id'[integer]);

response: { message: 'Sucessfully deactivated identity', status: true }

```
#### generate token
```javascript
await new auth.Identity().setToken(token).generateToken('id'[integer], ['*'][array], 1573488000[date][timestamp] , false [boolean], 1568943952000 [date][timestamp]));

response: {
  token: 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6ImE1ZjUzZmEyNWYyZjgyYTM4NDNjNGFmMTFiZDgwMWExIn0.eyJleHAiOjE1Njg4ODYxMzYsInN1YiI6InVzZXI6Ly9zYW5kYm94LzE1Njg3OTk3MjYvMTk4LzEzODcvMTU3MyIsIm5iZiI6MTU2ODgyMjQwMCwiYXVkaWVuY2UiOlsiKiJdLCJpYXQiOjE1Njg3OTk3MzYsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.ALErkhfkPS65FFHlkozN3eueB_7bhWI4T7oQN4qnwbsqcEB3fExiGe4ad-sUo6LikeJF80AQXSnljR5Zxd4dvc7HAMNVuIuTHDc1tr9-iFwMZoozh2iNO-dPjafkEEj0QmaCL6u_b6C3tKDjCB8oDsfJV6sPiy93t7Tva2D69_1r_4pU',
  status: true
}

```

