# redis-graph

a powerful graph implementation using [redis sets](http://redis.io/commands#set)

[![Build Status](https://secure.travis-ci.org/tblobaum/redis-graph.png)](http://travis-ci.org/tblobaum/redis-graph)

# Methods

`redis-graph` uses an instance of `node_redis` to connect to redis with

``` js

var Node = require('redis-graph')
Node.setClient(require('redis').createClient())

```

## Node(id [, opts])
return a new `node` 

An options argument with `inner` and `outer` properties can be passed as the second argument, which will be used for the inner/outer edges for the node. 

`inner` defaults to `'membership'` and `'outer'` defaults to `'members'`

The defaults are suitable for a graph of groups. These edge names could be something else, e.g. `'followers'` and `'following'` to mimic twitter's social graph.

Note: The `nodes` argument to all api calls below can either be a string id (e.g. `'user'`), an array of ids (e.g. `[ 'user', 'admin' ]`), an instance of `Node` or an array of instances of `Node`


``` js

var Node = require('redis-graph')
Node.setClient(require('redis').createClient())

var myGroup = Node('me')
  , yourGroup = Node('you')
  , adminGroup = Node('admin')
  , userGroup = Node('user')

userGroup.members.add('me', function (error) {
  userGroup.members.add('you', function (erro) {
    myGroup.members.add('you', function (err) {
      yourGroup.members.add('me', function (er) {
        adminGroup.members.add('you', function (e) {
          // do something with the connections
          // ..

        })
      })
    })
  })
})

```

## .{members,membership}.add(nodes, function (error) { ... })
add an edge or edges to `nodes` from this instance

``` js
Node('user').members.add('me', function (error) {
  // ..
})

// is exactly the same as
Node('me').membership.add('user', function (error) {
  // ..
})
```

## .{members,membership}.all(function (error, nodes) { ... })
return a list of nodes

``` js
Node('user').members.all(function (err, nodes) {
  console.log(nodes)
  // => [ 'me' ]
})

Node('me').membership.all(function (err, nodes) {
  console.log(nodes)
  // => [ 'user' ]
})
```

## .{members,membership}.delete(nodes, function (error) { ... })
remove an edge or edges from `nodes` to this instance

``` js
Node('user').members.delete('me', function (err, nodes) {
  console.log(nodes)
  // => [ 'me' ]
})

// is exactly the same as
Node('me').membership.delete('user', function (err, nodes) {
  console.log(nodes)
  // => [ 'user' ]
})
```

## .{members,membership}.union(nodes, function (error, nodes) { ... })
return a union of the edges with the `nodes` edges provided with logical `||`

``` js
Node('you').membership.union('me', function (e, nodes) {
  // do something with the list of memberships either `'you'` || `'me'` have
  // ..
})

Node('user').members.union('admin', function (e, nodes) {
  // do something with the members of `'user'` and `'admin'`
  // ..
})
```

## .{members,membership}.intersect(nodes, function (error, nodes) { ... })
return an intersection of the edges with the `nodes` edges provided, with logical `&&`

``` js
Node('you').membership.intersect('me', function (e, nodes) {
  // do something with the list of memberships both `'you'` && `'me'` have
  // ..
})
```

## .{members,membership}.without(nodes, function (error, nodes) { ... })
return the result of a subtraction of the `nodes` edges from the instance's edges

``` js
Node('you').membership.without('me', function (e, nodes) {
  // do something with the list of memberships `'you'` have that `'me'` does not have
  // ..
})
```

## .{members,membership}.{members,membership}(function (error, nodes) { ... })
return the nodes of the edges we have edges to! (similar to `all`, but another level deep)

``` js
Node('you').membership.membership(function (e, nodes) {
  // do something with a list of nodes that have membership to the nodes that i have membership to
  // ..
})

Node('you').membership.members(function (e, nodes) {
  // do something with a list of nodes that are members of the nodes that i have membership to
  // ..
})
```

## .delete(function (error) { ... })
delete this instance and remove all of its edges from redis

``` js
Node('user').delete(function (err) {
  // ..

})
```

# Example

Check the examples directory for more stuff.

``` js
var Node = require('./')
Node.setClient(require('redis').createClient())

var myGroup = Node('me', { inner : 'membership', outer : 'members' })
var yourGroup = Node('you', { inner : 'membership', outer : 'members' })
var adminGroup = Node('admin', { inner : 'membership', outer : 'members' })
var userGroup = Node('user', { inner : 'membership', outer : 'members' })

userGroup.members.add('me', function (err) {
  userGroup.members.add('you', function (err) {
    myGroup.members.add('you', function (err) {
      yourGroup.members.add('me', function (err) {
        adminGroup.members.add('you', function (e) {

          // 
          // Members
          // - having a member
          // 

          userGroup.members.all(function (e, nodes) {
            console.log('err', e)
            console.log('members of "user":', nodes)
            // => [ 'you', 'me' ]
          })

          myGroup.members.all(function (e, nodes) {
            console.log('err', e)
            console.log('members of "me":', nodes)
            // => [ 'you' ]
          })

          yourGroup.members.all(function (e, nodes) {
            console.log('err', e)
            console.log('members of "you":', nodes)
            // => [ 'me' ]
          })

          adminGroup.members.all(function (e, nodes) {
            console.log('err', e)
            console.log('members of "admin":', nodes)
            // => [ 'you' ]
          })

          userGroup.members.union('admin', function (e, nodes) {
            console.log('err', e)
            console.log('members of "user" || "admin":', nodes)
            // => [ 'you', 'me' ]
          })

          userGroup.members.intersect('admin', function (e, nodes) {
            console.log('err', e)
            console.log('members of both "user" && "admin":', nodes)
            // => [ 'you' ]
          })

          userGroup.members.without('admin', function (e, nodes) {
            console.log('err', e)
            console.log('members of "user" without members of "admin":', nodes)
            // => [ 'me' ]
          })

          userGroup.members.members(function (e, nodes) {
            console.log('err', e)
            console.log('members of the members of "user":', nodes)
            // => [ 'you', 'me' ]
          })

          userGroup.members.membership(function (e, nodes) {
            console.log('err', e)
            console.log('membership of the members of "user":', nodes)
            // => [ 'user', 'you', 'admin', 'me' ]
          })

          // 
          // Membership
          // - being a member
          // 

          userGroup.membership.all(function (e, nodes) {
            console.log('err', e)
            console.log('membership of "user":', nodes)
            // => [ ]
          })

          myGroup.membership.all(function (e, nodes) {
            console.log('err', e)
            console.log('membership of "me":', nodes)
            // => [ 'user', 'you' ]
          })

          yourGroup.membership.all(function (e, nodes) {
            console.log('err', e)
            console.log('membership of "you":', nodes)
            // => [ 'user', 'admin', 'me' ]
          })

          adminGroup.membership.all(function (e, nodes) {
            console.log('err', e)
            console.log('membership of "admin":', nodes)
            // => [ ]
          })

          yourGroup.membership.union('me', function (e, nodes) {
            console.log('err', e)
            console.log('membership of either "you" || "me":', nodes)
            // => [ 'user', 'you', 'me', 'admin' ]
          })

          yourGroup.membership.intersect('me', function (e, nodes) {
            console.log('err', e)
            console.log('membership of "you" && "me":', nodes)
            // => [ 'user' ]
          })

          yourGroup.membership.without('me', function (e, nodes) {
            console.log('err', e)
            console.log('membership of "you" without "me":', nodes)
            // => [ 'me', 'admin' ]
          })

          yourGroup.membership.membership(function (e, nodes) {
            console.log('err', e)
            console.log('membership of the membership of "you":', nodes)
            // => [ 'user', 'you' ]
          })

          yourGroup.membership.members(function (e, nodes) {
            console.log('err', e)
            console.log('members of the membership of "you":', nodes)
            // => [ 'you', 'me' ]
          })

        })
      })
    })
  })
})

```

# Install

`npm install redis-graph`

# Tests

With redis running locally do:

`npm install -g tap && npm test`

# License

(The MIT License)

Copyright (c) 2012 Thomas Blobaum <tblobaum@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.