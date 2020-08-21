const e = require('@skarllet/events')

const clearArray = array => {
  while (array.length) {
    array.pop();
  }
}

module.exports = {
  create: (handler = async () => {}) => {
    const { emmit, on } = e.create()

    const queue = []

    const next = () => {
      if (!queue.length) {
        emmit('finished')
        return
      }

      try {
        const item = queue.shift()

        emmit('next', item)

        handler(params)
          .then(() => next())
          .catch(error => emmit('error', error))

      } catch (error) {
        emmit('error', error)
      }
    }

    const push = (event = '', payload = null) => queue.push({event, payload})

    const start = () => next()

    const clear = () => clearArray(queue)

    return {
      on,
      push,
      start,
      clear,

      get current() {
        return [ ...queue ]
      },
    }
  }
}
