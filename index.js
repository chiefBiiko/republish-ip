module.exports = Object.freeze({
  keys (obj) {
    return Object.keys(obj)
  },
  values (obj) {
    return Object.keys(obj).map(function (k) { return this[k] }, obj)
  },
  props (obj) {
    return Object.keys(obj).map(function (k) { return [ k, this[k] ] }, obj)
  },
  map (obj, func, that) { // func(val, key, obj)
    return this.props(obj).reduce(function (acc, cur) {
      acc[cur[0]] = func.apply(that, cur.reverse().concat(this))
      return acc
    }, {}, obj)
  },
  filter (obj, func, that) { // func(val, key, obj)
    return this.props(obj).reduce(function (acc, cur) {
      if (!func.apply(that, cur.reverse().concat(this))) delete acc[cur[1]]
      return acc
    }, obj, obj)
  },
  reduce (obj, func, init, that) { // func(acc, cur, key, obj)
    return (function step (i, acc, props, obj, func, that) {
      if (i > props.length - 1) return acc
      return step(i + 1,
                  func.call(that, acc, props[i][1], props[i][0], obj),
                  props, obj, func, that)
    })(0, init, this.props(obj), obj, func, that)
  },
  forEach (obj, func, that) { // func(val, key, obj)
    this.props(obj).forEach(function (p) {
      func.apply(that, p.reverse().concat(this))
    }, obj)
  },
  every (obj, func, that) { // func(val, key, obj)
    return this.props(obj).every(function (p) {
      return func.apply(that, p.reverse().concat(this))
    }, obj)
  },
  some (obj, func, that) { // func(val, key, obj)
    const props = this.props(obj)
    for (const p of props) {
      if (func.apply(that, p.reverse().concat(obj))) return true
    }
    return false
  },
  randomProp (obj) {
    const props = this.props(obj)
    return props[Math.floor(Math.random() * props.length)]
  },
  randomKey (obj) {
    const ks = Object.keys(obj)
    return ks[Math.floor(Math.random() * ks.length)]
  },
  randomVal (obj) {
    const vs = this.values(obj)
    return vs[Math.floor(Math.random() * vs.length)]
  },
  hasProps (obj, props) {
    return props.every(function (p) {
      return this.some(obj, function (v, k) {
        return k === p[0] && v === p[1]
      })
    }, this)
  },
  hasKeys (obj, ...keys) {
    return keys.every(Object.prototype.hasOwnProperty.bind(obj))
  },
  hasVals (obj, ...vals) {
    const vs = this.values(obj)
    return vals.every(function (val) {
      return vs.includes(val)
    })
  },
  keysOf (obj, val) {
    return Object.keys(this.filter(obj, function (v) {
      return v === val
    }))
  },
  extend (target, ...sources) {
    var self = this
    return sources.reduce(function (acc, cur) {
      self.forEach(cur, function (v, k, o) {
        acc[k] = v
      })
      return acc
    }, this.clone(target))
  },
  extendLock (target, ...sources) {
    var self = this
    return sources.reduce(function (acc, cur) {
      self.forEach(cur, function (v, k, o) {
        if (!self.hasKeys(acc, k)) acc[k] = v
      })
      return acc
    }, this.clone(target))
  },
  clone (obj) {
    return this.map(obj, function (v) { return v })
  },
  isEmpty (obj) {
    return !Object.keys(obj).length
  },
  size (obj) {
    return Object.keys(obj).length
  }
})
