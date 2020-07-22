const e = require('@skarllet/events')

const clearArray = array => {
  while (array.length) {
    array.pop();
  }
}

module.exports = {
  create: () => {
    const { emmit, on } = e.create()

    const events = {}
    const queue = []

    const next = () => {
      if (!queue.length) return // ends the loop

      const { event, params } = queue.shift() // { event, params }
      const current = events[event](params)

      emmit('next', { event, params })

      current.then(() => next())
    }

    const push = (event = '', params = null) => queue.push({event, params})

    const start = () => next()

    const clear = () => clearArray(queue)

    const register = object => Object.entries(object).map(([key, value]) => events[key] = value)

    return {
      on,
      push,
      start,
      clear,
      register,

      get current() {
        return [ ...queue ]
      },

      get events() {
        return { ...events }
      }
    }
  }
}
