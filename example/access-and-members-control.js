var client = require('redis').createClient()
  , group = require('../')

group
  .setEdges({ inner : 'access', outer : 'members' })
  .setClient(client)

var Tom = group('tom')
  , Bob = group('bob')
  , Bill = group('bill')

// 
// Member and access control
// 

// setup some additional groups
var nodejs = group('nodejs')
  , otherGroup = group('otherGroup')
  , javascript = group('javascript')

Tom.access.add('nodejs', log)
// same as Tom.access.add(nodejs, log)
// same as nodejs.members.add('tom', log)
// same as nodejs.members.add(Tom, log)

Tom.access.add('otherGroup', log)
Tom.access.add('javascript', log)
Bob.access.add('javascript', log)
Bill.access.add('javascript', log)

Tom.access.all(log)
// => [ 'javascript', 'nodejs', 'redis', 'anonymous', 'admin', 'one', 'two' ]

// oh, and this
nodejs.members.add(javascript, log)

// is the same thing as this
javascript.access.add(nodejs, log)

// the javascript group members
javascript.members.all(log)
// => [ 'tom', 'bob', 'bill' ]

// the nodejs group members
nodejs.members.all(log)
// => [ 'tom', 'javascript' ]

Bill.access.all(log)
// => [ 'javascript', 'anonymous' ]

Bill.members.all(log)
// => [ ]

otherGroup.members.all(log)
// => [ 'tom' ]

// 
// intersections can be used to gain information. As an example, you
// can find a subset of a group that another group has access to:

// get the groups that tom's group has access to that are members of nodejs
Tom.access.with(nodejs, log)
// => [ 'javascript' ]

// same
Tom.access.with('nodejs', log)
// => [ 'javascript' ]

// or to get the same information a slightly different way
// the members of a group (nodejs) that tom has access to
nodejs.members.with('tom', log)
// => [ 'javascript' ]

// or
nodejs.members.with(Tom, log)
// => [ 'javascript' ]

// delete a group and all connections to that group
Tom.delete(log)
Bob.delete(log)
Bill.delete(log)
nodejs.delete(log)
otherGroup.delete(log)
javascript.delete(log)

function log (error, result) {
  console.log.apply(console, arguments)
  t.strictEqual(error, null, 'errors should be null')
}

client.end()
