const queue = require('../index')

describe('Checks the return of the module', () => {
  test('The Query object should have a "create" property', () => {
    expect(queue).toHaveProperty('create')
  })

  test('The "create" property should be an function', () => {
    expect(typeof queue.create).toBe('function')
  })
})

describe('Queue', () => {
  test('The object should have the properties: on, push, start, clear, register, events and current', () => {
    const q = queue.create()

    // Expose the functionality api
    expect(q).toHaveProperty('on')
    expect(q).toHaveProperty('push')
    expect(q).toHaveProperty('start')
    expect(q).toHaveProperty('clear')

    // Expose the events and current queue order
    expect(q).toHaveProperty('current')
  })

  describe('Tests the call of an event handler in the Queue passed by the events param', () => {
    const mockEventHandler = jest.fn(() => Promise.resolve())

    const q = queue.create(mockEventHandler)

    q.push({ foo: 'bar' })

    q.start()

    test('the event handler should be called one time', () => {
      expect(mockEventHandler).toHaveBeenCalled()
    })

    test('the event handler should recieve 1 arguments', () => {
      expect(mockEventHandler.mock.calls[0].length).toBe(1)
    })

    describe('Tests the argument recieved by the handler', () => {
      const firstArgument = mockEventHandler.mock.calls[0][0]

      test('it should be an object', () => {
        expect(typeof firstArgument).toBe('object')
        expect(Array.isArray(firstArgument)).toBe(false)
      })

      test('it should have the propety foo', () => {
        expect(firstArgument).toHaveProperty('foo')
      })
    })
  })

  describe('Tests the chain effect of event handler calls in the Queue', () => {
    const handler = jest.fn(() => Promise.resolve())
    const q = queue.create(handler)

    q.push('event:foo')
    q.push('event:bar')

    q.start()

    test('the event handler should be called one two times', () => {
      expect(handler).toHaveBeenCalledTimes(2)
    })

    test('the first call of the event handler should be called with the corect params', () => {
      expect(handler.mock.calls[0][0]).toMatch('event:foo')
    })

    test('the second call of the event handler should be called with the corect params', () => {
      expect(handler.mock.calls[1][0]).toMatch('event:bar')
    })
  })

  describe('Tests the `current` property', () => {
    test('The `current` property should have a length of 3', () => {
      const q = queue.create()

      q.push('event:foo')
      q.push('event:bar')
      q.push('event:baz')

      expect(q.current.length).toBe(3)
    })

    test('The first item of the `current` property should be an object with the properties: `event` and `params`', () => {
      const q = queue.create()

      q.push({ event: 'foo', params: 'bar' })

      const item = q.current[0]

      expect(typeof item).toBe('object')
      expect(Array.isArray(item)).toBe(false)

      expect(item).toHaveProperty('event')
      expect(item).toHaveProperty('params')
    })

    test('The`current` should be immutable', () => {
      const q = queue.create()

      q.push({ foo: 'bar' })

      // Create a snapshot of the array to compare later
      const snapshot = [ ...q.current ]

      // Try to modify the array
      q.current[1] = 'hey im trying to change the array 🤭'

      expect(q.current).toEqual(snapshot)
    })
  })

  describe('Tests the `on` property', () => {
    test('Should emmit an event `next`', done => {
      const q = queue.create()

      q.on('next', () => done())

      q.push({})

      q.start()
    })

    test('Should emmit an event `finish` when the queue doesnt have any itens to shift from the array', done => {
      const q = queue.create()

      q.on('finish', () => done())

      q.push({})

      q.start()
    })

    test('Should emmit an event `error` when the event async handler (function) called throws an error', done => {
      const error = new Error('Hey this is an error')
      const q = queue.create(() => Promise.reject(error))

      q.on('error', ({ message }) => {
        expect(message).toMatch(error.message)
        done()
      })

      q.push({})

      q.start()
    })
  })
})
