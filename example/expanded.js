var assert = require('assert')
  , client = require('redis').createClient()
  , group = require('../')

group.setClient(client)

var tom = group('tom')
  , bob = group('bob')
  , sarah = group('sarah')
  , nodejs = group('nodejs')
  , bash = group('bash')
  , javascript = group('javascript')

// 
// Member and membership control
// 

tom.membership.add('nodejs', log())
tom.membership.add('bash', log())
tom.membership.add('javascript', log())
bob.membership.add('javascript', log())
sarah.membership.add('javascript', log())
nodejs.members.add(javascript, log())
// javascript.membership.add(nodejs, log())

nodejs.members.all(log('members of nodejs:'))
javascript.members.all(log('members of javascript:'))
bash.members.all(log('members of bash:'))
tom.members.all(log('members of tom:'))
bob.members.all(log('members of bob:'))
sarah.members.all(log('members of sarah:'))

nodejs.membership.all(log('nodejs membership:'))
javascript.membership.all(log('javascript membership:'))
bash.membership.all(log('bash membership:'))
tom.membership.all(log('tom membership:'))
bob.membership.all(log('bob membership:'))
sarah.membership.all(log('sarah membership:'))

// intersections can be used to gain new information about the graph. 
// As an example, you can find a subsets of groups in various ways:

bob.membership.without('tom', log('bob membership without tom:'))
bob.membership.intersect('tom', log('bob membership intersected with tom:'))
javascript.membership.intersect('tom', log('javascript members intersected with tom:'))

nodejs.members.without('bash', log('nodejs members without bash:'))
nodejs.members.intersect('bash', log('nodejs members intersected with bash:'))

// 
// Combining two groups
// 
// tom and bob
// 

// get the groups that *both* tom and bob can membership (AND)
tom.membership.intersect(bob, log('memberships of tom && bob'))
// => [ 'anonymous', 'one', 'two' ]

// get the groups that *either* tom or bob can membership (XOR)
tom.membership.union(bob, log('memberships of tom || bob'))
// => [ 'anonymous', 'admin', 'one', 'two', 'three', 'four', 'five' ]

// get the membership that tom has that bob does not have
tom.membership.without(bob, log('memberships of tom that bob does not have'))
// => [ 'admin' ]

// 
// Combining many groups
// 
// tom, bob and sarah
// 

// get the groups that each of tom, bob, and sarah can membership (AND)
tom.membership.intersect([ bob, sarah ], log('memberships of tom && bob && sarah'))
// => [ 'anonymous' ]

// get the groups that at least one of tom, bob, or sarah has membership to (XOR)
tom.membership.union([ bob, sarah ], log('memberships of tom || bob || sarah'))
// => [ 'anonymous', 'admin', 'one', 'two', 'three', 'four', 'five' ]

// get the membership that tom has that sarah and bob do not have
tom.membership.without([ bob, sarah ], log('memberships of tom !== sarah && memberships of tom !== bob'))
// => [ 'admin' ]


// delete nodes and all connections 
tom.delete(log())
bob.delete(log())
sarah.delete(log())
nodejs.delete(log())
bash.delete(log())
javascript.delete(log())

function log (str) {
  return function (error, result) {
    var args = Array.prototype.slice.call(arguments)
    args[0] = (str || '')
    console.log.apply(console, args)
    assert.strictEqual(error, null, 'errors should be null')
  }
}

// client.end()
