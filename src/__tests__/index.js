const queue = require('../index');

describe('Checks the return of the module', () => {
  test('The Query object should have a "create" property', () => {
    expect(queue).toHaveProperty('create');
  });

  test('The "create" property should be an function', () => {
    expect(typeof queue.create).toBe('function');
  });
})

describe('Queue', () => {
  test('The `create` function should return an Object', () => {
    const q = queue.create();
    expect(typeof q).toBe('object')
  });

  test('The object should have the properties: on, push, start, clear, register, events and current', () => {
    const q = queue.create();

    // Expose the functionality api
    expect(q).toHaveProperty('on');
    expect(q).toHaveProperty('push');
    expect(q).toHaveProperty('start');
    expect(q).toHaveProperty('clear');
    expect(q).toHaveProperty('register');

    // Expose the events and current queue order
    expect(q).toHaveProperty('events');
    expect(q).toHaveProperty('current');
  });

  describe('Tests the call of an event handler in the Queue passed by the events param', () => {
    const mockEventHandler = jest.fn(async () => {})

    const events = {
      'event:foo': mockEventHandler,
    }

    const params = [ 'foo', 'bar' ]

    const q = queue.create()

    q.register(events)

    q.push('event:foo', params);

    q.start();

    test('the event handler should be called one time', () => {
      expect(mockEventHandler.mock.calls.length).toBe(1);
    });

    test('the event handler should recieve 1 arguments', () => {
      expect(mockEventHandler.mock.calls[0].length).toBe(1);
    });


    // The second argument is the context object, it gives access to funct ionalities across the events
    describe('Tests the first argument recieved by the event handler', () => {
      const firstArgument = mockEventHandler.mock.calls[0][0];

      test('it should be an object', () => {
        expect(typeof firstArgument).toBe('object');
      });
    });
  })

  describe('Tests the chain effect of event handler calls in the Queue', () => {
    const events = {
      'event:foo': jest.fn(async () => {}),
      'event:bar': jest.fn(async () => {}),
      'event:baz': jest.fn(async () => {}),
    }

    const q = queue.create();

    q.register(events);

    q.push('event:foo');
    q.push('event:bar');

    q.start();

    test('the event handler of the event "event:foo" should be called one time', () => {
      expect(events['event:foo'].mock.calls.length).toBe(1);
    });

    test('the event handler of the event "event:bar" should be called one time', () => {
      expect(events['event:bar'].mock.calls.length).toBe(1);
    });

    test("the event handler of the event 'event:baz' shouldn't be called", () => {
      expect(events['event:baz'].mock.calls.length).toBe(0);
    });

    test('the event handler of the event "event:foo" should be called before "event:bar"', () => {
      expect(events['event:foo']).toHaveBeenCalledBefore(events['event:bar']);
    });
  })

  describe('Tests the `current` property', () => {
    test('The `current` property should have a length of 3', () => {

      const q = queue.create();

      q.register({});

      q.push('event:foo');
      q.push('event:bar');
      q.push('event:baz');

      expect(q.current.length).toBe(3)
    })

    test('The first item of the `current` property should be an object with the properties: `event` and `params`', () => {
      const q = queue.create();

      q.register({});

      q.push('event:foo', {});

      const item = q.current[0]

      expect(typeof item).toBe('object')
      expect(Array.isArray(item)).toBe(false)

      expect(item).toHaveProperty('event')
      expect(item).toHaveProperty('params')
    })

    test('The`current` should be immutable', () => {
      const q = queue.create();

      q.register({});

      q.push('event:foo', {});

      // Create a snapshot of the array to compare later
      const snapshot = [ ...q.current ]

      // Try to modify the array
      q.current[1] = 'hey im trying to change the array 🤭'

      expect(q.current).toEqual(snapshot)
    })
  })

  describe('Tests the `on` property', () => {
    test('Should emmit an event `next`', done => {
      const q = queue.create();
      const eventName = 'event:foo';

      q.on('next', ({ payload: { event } }) => {
        expect(event).toMatch(eventName)
        done()
      })

      q.register({
        [eventName]: async () => {},
      })

      q.push(eventName, {})

      q.start()
    })
  })
})
