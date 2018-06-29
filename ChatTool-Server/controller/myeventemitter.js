const EventEmitter = require('events')

class MyEmitter extends EventEmitter {
  
  constructor() {
    super()
  }

}

module.exports = new MyEmitter