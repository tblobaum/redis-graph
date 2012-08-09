var client = require('redis').createClient()
  , group = require('../')
  , Tom = group('tom')
  , Bob = group('bob')
  , Bill = group('bill')

group.setClient(client)

// 
// Simple access control
// 

// give tom access to the following groups
Tom.access.add('anonymous', log)
Tom.access.add('admin', log)
Tom.access.add('one', log)
Tom.access.add('two', log)

Bob.access.add('anonymous', log)
Bob.access.add('one', log)
Bob.access.add('two', log)
Bob.access.add('three', log)
Bob.access.add('four', log)
Bob.access.add('five', log)

Bill.access.add('anonymous', log)
Bill.access.add('admin', log)
Bill.members.add(Tom, log)

Tom.access.all(log)
// => [ 'anonymous', 'admin', 'one', 'two', 'bill' ]

Tom.access.delete(Bill, log)

Bob.access.all(log)
// => [ 'anonymous', 'one', 'two', 'three', 'four', 'five' ]

Bill.access.all(log)
// => [ 'anonymous', 'admin' ]

// remove bill's access to the admin group
Bill.access.delete('admin', log)

function log (error, result) {
  console.log.apply(console, arguments)
  t.strictEqual(error, null, 'errors should be null')
}

client.end()
