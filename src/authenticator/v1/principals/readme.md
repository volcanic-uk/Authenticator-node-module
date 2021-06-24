### Principal

#### create a new principal
```javascript
await new Principal.setToken(token).create(name[string], dataset[integer]);

response: {
  name: 'principal-test1568797139',
  dataset_id: 1568797139,
  updated_at: '2019-09-18T08:58:59.657Z',
  created_at: '2019-09-18T08:58:59.657Z',
  id: 190,
  status: true
}
````
#### get a principal by ID
```javascript
//get principal by id
await new Principal().setToken(token).getById(id[number]);

response: {
  id: 191,
  name: 'principal-test1568797290',
  dataset_id: 1568797290,
  last_active_date: null,
  login_attempts: 0,
  active: true,
  created_at: '2019-09-18T09:01:31.055Z',
  updated_at: '2019-09-18T09:01:31.055Z',
  status: true
}
```
#### get all principals
```javascript
await new Principal().setToken(token).getPrincipals(query[string], page[integer], pageSize[integer], sort[string], order[string]);

response: { 
    pagination: [Object], 
    data: [Array] 
}
```
#### update a principal
```javascript
await new Principal().setToken(token).update(id[integer], name[string], dataset[integer]);

response: {
  id: 192,
  name: 'principal-test1568797601',
  dataset_id: 1568797601,
  last_active_date: null,
  login_attempts: 0,
  active: true,
  created_at: '2019-09-18T09:06:41.628Z',
  updated_at: '2019-09-18T09:06:41.628Z',
  status: true
}

```
#### deleting a principal
```javascript
await new Principal().setToken(token).delete(id[integer]);

response:{ message: 'Successfully deleted', status: true }
```
