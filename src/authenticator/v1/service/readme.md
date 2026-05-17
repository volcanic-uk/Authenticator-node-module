### Services

#### create new service
```javascript
await new Service.setToken(token).create(name[string]);

response:  {
  name: 'new-service-1568798627',
  subject_id: '2',
  updated_at: '2019-09-18T09:24:00.434Z',
  created_at: '2019-09-18T09:24:00.434Z',
  id: 208,
  status: true
}

````
#### get a service by ID
```javascript
//get service by id
await new Service().setToken(token).getById(id[number]);

response:  {
  id: 210,
  name: 'new-service-1568798730',
  active: true,
  subject_id: 2,
  created_at: '2019-09-18T09:25:43.048Z',
  updated_at: '2019-09-18T09:25:43.048Z',
  status: true
}

```
#### get all services
```javascript
await new Service().setToken(token).getServices(query[string], page[integer], pageSize[integer], sort[string], order[string]);

response: { 
    pagination: [Object], 
    data: [Array] 
}
```
#### update a service
```javascript
await new Service().setToken(token).update(id[integer], name[string]);

response: {
  id: 212,
  name: 'service-name-update-1568798942',
  active: true,
  subject_id: 2,
  created_at: '2019-09-18T09:29:14.956Z',
  updated_at: '2019-09-18T09:29:17.995Z',
  status: true
}

```
#### deleting a service
```javascript
await new Service().setToken(token).delete(id[integer]);

response:{ message: 'Successfully deleted', status: true }
```
