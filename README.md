![Node.js Package](https://github.com/skarllet/queue/workflows/Node.js%20Package/badge.svg)

# Queue
This module is destinated to queue events;

## Install the module

### Instalation
```
npm install @skarllet/queue
```

### Usage
```
// To use the module inside Node JS
const queue = require('@skarllet/queue')

// Create a queue instance
const q = queue.create();

// Register some events
q.register({
  'event:foo': async ({ text }) => {
    console.log(text) // prints foo

    /* do something async*/
  },
})

// push an event and its parameters that will passed down to the event handler
q.push('event:foo', { text: 'foo' })

// Start the execution
q.start()
```
