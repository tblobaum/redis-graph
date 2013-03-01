var test = require('tap').test
var client = require('redis').createClient()
  , group = require('../');

group.setClient(client)

var Tom = group('tom')
  , Bob = group('bob')
  , Bill = group('bill')
  , nodejs = group('nodejs')
  , otherGroup = group('otherGroup')
  , javascript = group('javascript')

test('test all the things', function (t) {

  t.plan(98)

  Tom.membership.add('anonymous', function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result, [ 1, 1 ], 'result should be the same')
  })

  Tom.membership.has('admin', function (error, result) {
    t.notOk(result, 'result should be falsy')
  })

  Tom.membership.add('admin', function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result, [ 1, 1 ], 'result should be the same')
  })

  Tom.membership.has('admin', function (error, result) {
    t.ok(result, 'result should be truthy')
  });

  Tom.membership.add('one', function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result, [ 1, 1 ], 'result should be the same')
  })

  Tom.membership.add('two', function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result, [ 1, 1 ], 'result should be the same')
  })

  Bob.membership.add('anonymous', function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result, [ 1, 1 ], 'result should be the same')
  })

  Bob.membership.add('one', function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result, [ 1, 1 ], 'result should be the same')
  })

  Bob.membership.add('two', function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result, [ 1, 1 ], 'result should be the same')
  })

  Bob.membership.add('three', function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result, [ 1, 1 ], 'result should be the same')
  })

  Bob.membership.add('four', function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result, [ 1, 1 ], 'result should be the same')
  })

  Bob.membership.add('five', function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result, [ 1, 1 ], 'result should be the same')
  })

  Bill.membership.add('anonymous', function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result, [ 1, 1 ], 'result should be the same')
  })

  Bill.membership.add('admin', function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result, [ 1, 1 ], 'result should be the same')
  })

  Tom.membership.all(function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result.sort(), [ 'anonymous', 'admin', 'one', 'two' ].sort(), 'result should be the same')
  })

  Bob.membership.all(function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result.sort(), [ 'anonymous', 'one', 'two', 'three', 'four', 'five' ].sort(), 'result should be the same')
  })

  Bill.membership.all(function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result.sort(), [ 'anonymous', 'admin' ].sort(), 'result should be the same')
  })

  Bill.membership.delete('admin', function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result, [ 1, 1 ], 'result should be the same')
  })

  Tom.membership.intersect(Bob, function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result.sort(), [ 'anonymous', 'one', 'two' ].sort(), 'result should be the same')
  })

  Tom.membership.union(Bob, function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result.sort(), [ 'anonymous', 'admin', 'one', 'two', 'three', 'four', 'five' ].sort(), 'result should be the same')
  })

  Tom.membership.without(Bob, function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result.sort(), [ 'admin' ], 'result should be the same')
  })

  Tom.membership.intersect([ Bob, Bill ], function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result.sort(), [ 'anonymous' ], 'result should be the same')
  })

  Tom.membership.union([ Bob, Bill ], function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result.sort(), [ 'anonymous', 'admin', 'one', 'two', 'three', 'four', 'five' ].sort(), 'result should be the same')
  })

  Tom.membership.without([ Bob, Bill ], function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result.sort(), [ 'admin' ], 'result should be the same')
  })

  Tom.membership.add('nodejs', function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result, [ 1, 1 ], 'result should be the same')
  })

  Tom.membership.add('otherGroup', function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result, [ 1, 1 ], 'result should be the same')
  })

  Tom.membership.add('javascript', function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result, [ 1, 1 ], 'result should be the same')
  })

  Bob.membership.add('javascript', function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result, [ 1, 1 ], 'result should be the same')
  })

  Bill.membership.add('javascript', function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result, [ 1, 1 ], 'result should be the same')
  })

  Tom.membership.all(function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result.sort(), [ 'javascript', 'nodejs', 'otherGroup', 'anonymous', 'admin', 'one', 'two' ].sort(), 'result should be the same')
  })

  nodejs.members.add(javascript, function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result, [ 1, 1 ], 'result should be the same')
    javascript.membership.add(nodejs, function (error, result) {
      t.deepEqual(error, null, 'error should be null')
      t.deepEqual(result, [ 0, 0 ], 'result should be the same')
    })
  })

  javascript.members.all(function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result.sort(), [ 'tom', 'bob', 'bill' ].sort(), 'result should be the same')
  })

  nodejs.members.all(function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result.sort(), [ 'tom', 'javascript' ].sort(), 'result should be the same')
  })

  Bill.membership.all(function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result.sort(), [ 'javascript', 'anonymous' ].sort(), 'result should be the same')
  })

  Bill.members.all(function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result.sort(), [ ], 'result should be the same')
  })

  otherGroup.members.all(function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result.sort(), [ 'tom' ], 'result should be the same')
  })

  nodejs.members.members(function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result.sort(), [ 'bill', 'bob', 'tom' ].sort(), 'result should be the same')
  })

  nodejs.members.membership(function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result.sort(), [ 'nodejs', 'javascript', 'otherGroup', 'anonymous', 'admin', 'two', 'one' ].sort(), 'result should be the same')
  })

  nodejs.membership.membership(function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result.sort(), [ ], 'result should be the same')
  })

  nodejs.membership.members(function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result.sort(), [ ], 'result should be the same')
  })

  Tom.membership.intersect(nodejs, function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result.sort(), [ ], 'result should be the same')
  })

  nodejs.members.intersect(javascript, function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result.sort(), [ 'tom' ], 'result should be the same')
  })

  javascript.members.intersect(nodejs, function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.deepEqual(result.sort(), [ 'tom' ], 'result should be the same')
  })

  Tom.delete(function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.type(result, Array, 'result should be the same')
  })

  Bob.delete(function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.type(result, Array, 'result should be the same')
  })

  Bill.delete(function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.type(result, Array, 'result should be the same')
  })

  nodejs.delete(function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.type(result, Array, 'result should be the same')
  })

  otherGroup.delete(function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.type(result, Array, 'result should be the same')
  })

  javascript.delete(function (error, result) {
    t.deepEqual(error, null, 'error should be null')
    t.type(result, Array, 'result should be the same')
  })

})

test('close redis connection', function (t) {
  client.end()
  t.end()
})
