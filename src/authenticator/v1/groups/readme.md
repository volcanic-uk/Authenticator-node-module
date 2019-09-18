#### create a Group
```javascript
await new Group().withAuth().create(name[string], permissions[array], description[string]);

response: { 
    name: 'g******************1',
    description: 'test group for module',
    updated_at: '2019-09-18T07:47:00.005Z',
    created_at: '2019-09-18T07:47:00.005Z',
    id: 532 
}
```

#### get a Group by id
```javascript
await new Group().withAuth().getByID(id[number]);

response: { 
    name: 'g******************1',
    description: 'test group for module',
    updated_at: '2019-09-18T07:47:00.005Z',
    created_at: '2019-09-18T07:47:00.005Z',
    id: 532 
}
```

#### get a Group by name
```javascript
await new Group().withAuth().getByName(name[string]);

response: { 
    name: 'g******************1',
    description: 'test group for module',
    updated_at: '2019-09-18T07:47:00.005Z',
    created_at: '2019-09-18T07:47:00.005Z',
    id: 532 
}
```

#### update a Group
```javascript
await new Group().withAuth().update(id[number], name[string], description[string]);

response: { 
    name: 'g******************1',
    description: 'test group for module',
    updated_at: '2019-09-18T07:47:00.005Z',
    created_at: '2019-09-18T07:47:00.005Z',
    id: 532 
}
```

#### get Groups
```javascript
await new Group().withAuth().getGroups(query[string], page[number], pageSize[number], sor[stringt, order[string]);

response: { 
    pagination: [Object], 
    data: [Array] 
}
```

#### delete a Group
```javascript
await new Group().withAuth().delete(id[number]);

response:{ 
    message: 'Successfully deleted privilege'
} 
```