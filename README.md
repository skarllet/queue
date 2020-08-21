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

// Define a handler
const handler = item => {
  console.log(item)
}

// Create a queue instance and pass the handler to it
const q = queue.create(handler)

// push an event and its parameters that will passed down to the handler
q.push({ text: 'foo' })
q.push({ text: 'bar' })

// Start the execution
q.start()
// log: { text: 'foo' }
// log: { text: 'bar' }
```
