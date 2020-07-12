const clearArray = array => {
  while (array.length) {
    array.pop();
  }
}

module.exports = {
  create: (events = {}) => {
    const queue = [];

    const next = () => {
      if (!queue.length) return // ends the loop

      const { event, params } = queue.shift() // { event, params }
      const current = events[event](params)

      current.then(() => next())
    }

    const push = (event = '', params = null) => queue.push({event, params})

    const start = () => next()

    const clear = () => clearArray(queue)

    return { push, start, clear }
  }
}
