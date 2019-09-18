#### create a new role
```javascript
await new role().withAuth().create(name[string], serviceId[number], privileges[array]);

response: { 
    name: 'r*****************1',
    subject_id: '2',
    service_id: 544,
    updated_at: '2019-09-18T07:47:00.563Z',
    created_at: '2019-09-18T07:47:00.563Z',
    id: 526 
} 
```

#### get a role by id
```javascript
await new role().withAuth().getById(id[number]);

response: { 
    name: 'r*****************1',
    subject_id: '2',
    service_id: 544,
    updated_at: '2019-09-18T07:47:00.563Z',
    created_at: '2019-09-18T07:47:00.563Z',
    id: 526 
} 
```

#### get a role by name
```javascript
await new role().withAuth().getByName(name[string]);

response: { 
    name: 'r*****************1',
    subject_id: '2',
    service_id: 544,
    updated_at: '2019-09-18T07:47:00.563Z',
    created_at: '2019-09-18T07:47:00.563Z',
    id: 526 
} 
```

#### get roles
```javascript
await new role().withAuth().getRoles(query[string], page[number], pageSize[number], sort[string], order[string]);

response: { 
    pagination: [Object], 
    data: [Array] 
}
```

#### update a role
```javascript
await new role().withAuth().update(id[number], name[string], serviceId[number], privileges[array]);

response: { 
    name: 'r*****************1',
    subject_id: '2',
    service_id: 544,
    updated_at: '2019-09-18T07:47:00.563Z',
    created_at: '2019-09-18T07:47:00.563Z',
    id: 526 
} 
```

#### delete a role
```javascript
await new role().withAuth().delete(id[number]);

response: { 
    message: 'Successfully deleted role'
} 
```