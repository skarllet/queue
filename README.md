![Node.js Package](https://github.com/snkrs-loop/queue/workflows/Node.js%20Package/badge.svg)

# Queue
This module is destinated to queue the events of the bot;

## Install the module
```
// Add install instructions
```

## Usage
```
// To use the module inside node JS
const Queue = require('@snkrs-loop/queue')

// Create a Queue

// Events are the functions that should be called in the order specified
const events = {
  'event:foo': async (context, params) => { /* do something boty*/ },
}

// This context object is passed to all event callbacks (aka: event handlers)
const context = {
  foo: 'bar'
}

// The Queue itself recieve the events and the context
const q = Queue.create(events, context);

// push an event and its parameters that will passed down to the event handler
q.push('event:foo', [ 'foo', 'bar' ]);

// Start the execution
q.start();
```
