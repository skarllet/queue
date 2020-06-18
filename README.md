![Node.js Package](https://github.com/snkrs-loop/queue/workflows/Node.js%20Package/badge.svg)

# Queue
This module is destinated to queue the events of the bot;

## Install the module
To use the module you need an ``` .npmrc ``` file with the following instructions:
```
@snkrs-loop:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=[YOUR_TOKEN]
```

After you configure your ``` .npmrc ```, you may want to install the packadge:
```
npm install @snkrs-loop/queue
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
