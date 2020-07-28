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

      try {
        const { event, params } = queue.shift()

        emmit('next', { event, params })

        const current = events[event]

        if (current === undefined)
          throw new Error(`Seems like the event '${event}' doesn't exists. Did you register it?`)

        if (typeof current !== 'function' || current.constructor.name !== "AsyncFunction")
          throw new Error(`Seems like the handler for the event '${event}' it's not a function or a Promise. Did you register it correctly?`)

        current(params)
          .then(() => next())
          .catch(error => emmit('error', error))

      } catch (error) {
        emmit('error', error)
      }
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
