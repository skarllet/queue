module.exports = {
  create: (events = [], context = {}) => {
    const queue = [];

    const next = () => {
      if (!queue.length) return // ends the loop

      const { event, params } = queue.shift() // { event, params }
      const current = events[event](context, params)

      current.then(() => next())
    }

    const push = (event = '', params = null) => queue.push({event, params})

    const start = () => next()

    return { push, start }
  }
}
