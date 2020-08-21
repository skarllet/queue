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
        emmit('finish')
        return
      }

      try {
        const item = queue.shift()

        emmit('next', item)

        handler(item)
          .then(() => next())
          .catch(error => emmit('error', error))

      } catch (error) {
        emmit('error', error)
        emmit('finish')
      }
    }

    const push = item => queue.push(item)

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
