var client = require('redis').createClient()
  , group = require('../')
  , Tom = group('tom')
  , Bob = group('bob')
  , Bill = group('bill')

group.setClient(client)

// 
// Combining two groups
// 
// Tom and Bob
// 

// get the groups that *both* tom and bob can access (AND)
Tom.access.in(Bob, log)
// => [ 'anonymous', 'one', 'two' ]

// get the groups that *either* tom or bob can access (XOR)
Tom.access.union(Bob, log)
// => [ 'anonymous', 'admin', 'one', 'two', 'three', 'four', 'five' ]

// get the access that tom has that bob does not have
Tom.access.difference(Bob, log)
// => [ 'admin' ]

// 
// Combining many groups
// 
// Tom, Bob and Bill
// 

// get the groups that *each* of tom, bob, and bill can access (AND)
Tom.access.in([ Bob, Bill ], log)
// => [ 'anonymous' ]

// get the groups that at least *one* of tom, bob, or bill can access (XOR)
Tom.access.union([ Bob, Bill ], log)
// => [ 'anonymous', 'admin', 'one', 'two', 'three', 'four', 'five' ]

// get the access that tom has that bill and bob do not have
Tom.access.difference([ Bob, Bill ], log)
// => [ 'admin' ]


function log (error, result) {
  console.log.apply(console, arguments)
  t.strictEqual(error, null, 'errors should be null')
}

client.end()
