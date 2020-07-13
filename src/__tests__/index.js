const Queue = require('../index');

describe('Checks the return of the module', () => {
  test('The Query object should have a "create" property', () => {
    expect(Queue).toHaveProperty('create');
  });

  test('The "create" property should be an function', () => {
    expect(typeof Queue.create).toBe('function');
  });
})

describe('Checks the funcionality of the "create" function', () => {
  test('The create function should return an Object', () => {
    const q = Queue.create();
    expect(typeof q).toBe('object')
  });

  test('The object should have the properties: push and start', () => {
    const q = Queue.create();

    expect(q).toHaveProperty('push');
    expect(q).toHaveProperty('start');
    expect(q).toHaveProperty('clear');
    expect(q).toHaveProperty('register');
  });

  describe('Tests the call of an event handler in the Queue passed by the events param', () => {
    const mockEventHandler = jest.fn(async () => {})

    const events = {
      'event:foo': mockEventHandler,
    }

    const params = [ 'foo', 'bar' ]

    const q = Queue.create()

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

    const q = Queue.create();

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
})
