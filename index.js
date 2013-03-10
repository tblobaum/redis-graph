var util = require('util')
  , format = util.format.bind(util)
  , db

/**
 * Return a new Node instance with `node` and `opts`
 *
 * @param {String || Object} node
 * @param {Object} opts
 * @return {Object} 
 * @api public
 */

module.exports = function (node, opts) {
  opts = opts || {}
  opts.inner = opts.inner || 'membership'
  opts.outer = opts.outer || 'members'
  return new Node(String(node), opts)
}

/**
 * Set the redis client
 *
 * @param {Object} client
 * @api public
 */

module.exports.setClient = function (client) {
  db = client
}

/**
 * Node Constructor
 */

function Node (id, opts) {
  var me = this
  this.id = id
  Object.defineProperty(me, 'inner', {
      value : opts.inner
    , enumerable : false
    , writable : true
  })
  Object.defineProperty(me, 'outer', {
      value : opts.outer
    , enumerable : false
    , writable : true
  })
  Object.defineProperty(me, this.inner, {
      value : new Edge({ inner : this.inner, outer : this.outer, id : id })
    , enumerable : false
    , writable : true
  })
  Object.defineProperty(me, this.outer, {
      value : new Edge({ inner : this.outer, outer : this.inner, id : id })
    , enumerable : false
    , writable : true
  })
}

/**
 * Return the string id of the node instance
 *
 * @return {String}
 * @api public
 */

Node.prototype.toString = function () {
  return this.id
}

/**
 * Delete the node and all of its edges
 *
 * @param {Function} cb
 * @api public
 */

Node.prototype.delete = function (cb) {
  var me = this
  db.multi()
    .smembers([ me[me.inner].innerkey ])
    .smembers([ me[me.outer].innerkey ])
    .exec(function (error, replies) {
      var multi = db.multi()
      replies.forEach(function (reply) {
        reply.forEach(function (gid) {
          multi
            .srem([ format(me.inner + '_%s', gid), me.id ])
            .srem([ format(me.outer + '_%s', gid), me.id ])
            .srem([ me[me.inner].innerkey, gid ])
            .srem([ me[me.outer].innerkey, gid ])
        })
      })
      multi.exec(cb)
    })
  ;
}

/**
 * Initialize a new `Edge` with inner/outer edge names
 *
 * @param {Object} opts
 */

function Edge (opts) {
  this.id = opts.id
  this.innerformat = opts.inner + '_%s'
  this.outerformat = opts.outer + '_%s'
  this.innerkey = format(this.innerformat, this.id)
  this.outerkey = format(this.outerformat, this.id)
  this[opts.inner] = function (cb) {
    this.all(function (error, array) {
      if (error) return cb(error)
      if (!array || !array.length) return cb(null, array || [])
      array = array.map(function (gid) { return format(this.innerformat, String(gid)) }, this)
      db.sunion(array, cb)
    }.bind(this))
  }
  this[opts.outer] = function (cb) {
    this.all(function (error, array) {
      if (error) return cb(error)
      if (!array || !array.length) return cb(null, array || [])
      array = array.map(function (gid) { return format(this.outerformat, gid) }, this)
      db.sunion(array, cb)
    }.bind(this))
  }
}

/**
 * Return all of the inner edges for the parent `node` instance
 *
 * @param {Function} cb
 */

Edge.prototype.all = function (cb) { 
  db.smembers([ this.innerkey ], cb)
}

/**
 * Add edges to `arr` for the parent `node` instance
 *
 * @param {String || Array} arr
 * @param {Function} cb
 */

Edge.prototype.add = function (arr, cb) { 
  arr = Array.isArray(arr) ? arr : [ arr ]
  arr = arr.map(String)
  var multi = db.multi()
  arr.forEach(function (gid) {
    multi.sadd([ this.innerkey, String(gid) ])
    multi.sadd([ format(this.outerformat, String(gid)), this.id ])
  }, this)
  multi.exec(cb)
}

/**
 * Checks if parent `node` instance has an edge to `member`
 *
 * @param {String} member
 * @param {Function} cb
 */

Edge.prototype.has = function (member, cb) {
  db.sismember(this.innerkey, member, cb)
}

/**
 * Delete edges to `arr` for the parent `node` instance
 *
 * @param {String || Array} arr
 * @param {Function} cb
 */

Edge.prototype.delete = function (arr, cb) { 
  arr = Array.isArray(arr) ? arr : [ arr ]
  arr = arr.map(String)
  var multi = db.multi()
  arr.forEach(function (gid) {
    multi.srem([ this.innerkey, String(gid) ])
    multi.srem([ format(this.outerformat, String(gid)), this.id ])
  }, this)
  multi.exec(cb)
}

/**
 * Return the inner edges with the edges of `arr` removed
 *
 * @param {String || Array} arr
 * @param {Function} cb
 */

Edge.prototype.without = function (arr, cb) {
  arr = Array.isArray(arr) ? arr : [ arr ]
  arr = arr.map(function (gid) { return format(this.innerformat, String(gid)) }, this)
  arr.unshift(this.innerkey)
  db.sdiff(arr, cb)
}

/**
 * Return an intersection (logical AND) of inner edges with those of `arr`
 *
 * @param {String || Array} arr
 * @param {Function} cb
 */

Edge.prototype.intersect = function (arr, cb) {
  arr = Array.isArray(arr) ? arr : [ arr ]
  arr = arr.map(function (gid) { return format(this.innerformat, String(gid)) }, this)
  arr.unshift(this.innerkey)
  db.sinter(arr, cb)
}

/**
 * Return a union (logical XOR) of inner edges with those of `arr`
 *
 * @param {String || Array} arr
 * @param {Function} cb
 */

Edge.prototype.union = function (arr, cb) {
  arr = Array.isArray(arr) ? arr : [ arr ]
  arr = arr.map(function (gid) { return format(this.innerformat, String(gid)) }, this)
  arr.unshift(this.innerkey)
  db.sunion(arr, cb)
}
