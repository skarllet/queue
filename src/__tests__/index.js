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
  test('The `create` function should return an Object', () => {
    const q = queue.create()
    expect(typeof q).toBe('object')
  })

  test('The object should have the properties: on, push, start, clear, register, events and current', () => {
    const q = queue.create()

    // Expose the functionality api
    expect(q).toHaveProperty('on')
    expect(q).toHaveProperty('push')
    expect(q).toHaveProperty('start')
    expect(q).toHaveProperty('clear')
    expect(q).toHaveProperty('register')

    // Expose the events and current queue order
    expect(q).toHaveProperty('events')
    expect(q).toHaveProperty('current')
  })

  describe('Tests the call of an event handler in the Queue passed by the events param', () => {
    const mockEventHandler = jest.fn()

    const events = {
      'event:foo': async params => mockEventHandler(params),
    }

    const params = [ 'foo', 'bar' ]

    const q = queue.create()

    q.register(events)

    q.push('event:foo', params)

    q.start()

    test('the event handler should be called one time', () => {
      expect(mockEventHandler).toHaveBeenCalled()
    })

    test('the event handler should recieve 1 arguments', () => {
      expect(mockEventHandler.mock.calls[0].length).toBe(1)
    })


    // The second argument is the context object, it gives access to funct ionalities across the events
    describe('Tests the first argument recieved by the event handler', () => {
      const firstArgument = mockEventHandler.mock.calls[0][0]

      test('it should be an object', () => {
        expect(typeof firstArgument).toBe('object')
      })
    })
  })

  describe('Tests the chain effect of event handler calls in the Queue', () => {
    const q = queue.create()

    const mockA = jest.fn()
    const mockB = jest.fn()
    const mockC = jest.fn()


    q.register({
      'event:foo': async () => mockA(),
      'event:bar': async () => mockB(),
      'event:baz': async () => mockC(),
    })

    q.push('event:foo')
    q.push('event:bar')

    q.start()

    test('the event handler of the event "event:foo" should be called one time', () => {
      expect(mockA).toHaveBeenCalled()
    })

    test('the event handler of the event "event:bar" should be called one time', () => {
      expect(mockB).toHaveBeenCalled()
    })

    test("the event handler of the event 'event:baz' shouldn't be called", () => {
      expect(mockC).not.toHaveBeenCalled()
    })

    test('the event handler of the event "event:foo" should be called before "event:bar"', () => {
      expect(mockA).toHaveBeenCalledBefore(mockB)
    })
  })

  describe('Tests the `current` property', () => {
    test('The `current` property should have a length of 3', () => {

      const q = queue.create()

      q.register({
        'event:foo': async () => {},
      })

      q.push('event:foo')
      q.push('event:bar')
      q.push('event:baz')

      expect(q.current.length).toBe(3)
    })

    test('The first item of the `current` property should be an object with the properties: `event` and `params`', () => {
      const q = queue.create()

      q.register({
        'event:foo': async () => {},
      })

      q.push('event:foo', {})

      const item = q.current[0]

      expect(typeof item).toBe('object')
      expect(Array.isArray(item)).toBe(false)

      expect(item).toHaveProperty('event')
      expect(item).toHaveProperty('params')
    })

    test('The`current` should be immutable', () => {
      const q = queue.create()

      q.register({
        'event:foo': async () => {},
      })

      q.push('event:foo', {})

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
      const eventName = 'event:foo'

      q.on('next', ({ event }) => {
        expect(event).toMatch(eventName)
        done()
      })

      q.register({
        [eventName]: async () => {},
      })

      q.push(eventName, {})

      q.start()
    })

    test('Should emmit an event `error` when try to call an event that is not registered', done => {
      const q = queue.create()

      q.on('error', ({ message }) => {
        expect(message).toMatch(`Seems like the event 'event:foo' doesn't exists. Did you register it?`)
        done()
      })

      q.register({})

      q.push('event:foo', {})

      q.start()
    })

    test('Should emmit an event `error` when try to call an event that is not an async function', done => {
      const q = queue.create()

      q.on('error', ({ message }) => {
        expect(message).toMatch(`Seems like the handler for the event 'event:foo' it's not a function or a Promise. Did you register it correctly?`)
        done()
      })

      q.register({
        'event:foo': () => {},
      })

      q.push('event:foo', {})

      q.start()
    })

    test('Should emmit an event `error` when the event async handler (function) called throws an error', done => {
      const q = queue.create()
      const error = new Error('Hey this is an error')

      q.on('error', ({ message }) => {
        expect(message).toMatch(error.message)
        done()
      })

      q.register({
        'event:foo': async () => { throw error },
      })

      q.push('event:foo', {})

      q.start()
    })
  })
})
