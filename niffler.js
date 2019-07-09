"use strict"

const fs = require('fs')
const stream = require('stream')

const { removeLineBreaks } = require('./rules')

class Niffler {
  constructor(config) {
    this.input = null
    this.output = null

    if (!config.input) {
      throw new Error('Input source is not specified')
    } else {
      this.initInput(config.input)
    }

    if(!config.output) {
      throw new Error('Output destination is not specified')
    } else {
      this.initOutput(config.output)
    }

    // We need to register modes to be able to perform
    // proper sniffling logic for each rule.
    this.result = []
    this.rules = config.rules || []
  }

  initInput(input) {
    if (typeof input === 'string') {
      // We should check whether a given input is a valid path
      if (fs.existsSync(input)) {
        this.input = fs.createReadStream(input)
      } else {
        throw new Error('Path specified does not seem to be a proper file')
      }
    } else {
      // Input is neither stream readable nor string path. Echo error
      if (!(input instanceof stream.Readable)) {
        throw new Error('Invalid Input source. Input is neither string path nor stream readable.')
      }
    }
  }

  initOutput(output) {
    if (typeof output === 'string') {
      // We should check whether a given input is a valid path
      if (fs.existsSync(output)) {
        this.output = fs.createWriteStream(output)
      }
    } else {
      // Input is neither stream readable nor string path. Echo error
      if (!(output instanceof stream.Writable)) {
        throw new Error('Invalid output source. Output is neither string path nor stream writable.')
      }

      this.output = output
    }
  }

  /**
   * Read html context from the given readable source.
   */
  read() {
    let context = ''
    let reader = this.input
    return new Promise((resolve, reject) => {
      this.input.on('data', onData)
      this.input.on('end', onEnd)
      this.input.on('error', onError)

      function onData(chunk) {
        context += chunk.toString('utf8')
      }

      function onEnd() {
        removeListeners()
        resolve(removeLineBreaks(context))
      }

      function onError(err) {
        removeListeners()
        reject(err)
      }

      function removeListeners () {
        reader.removeListener('data', onData)
        reader.removeListener('error', onError)
        reader.removeListener('end', onEnd)
      }
    })
  }

  detect () {
    // Read html context from stream readable
    const htmlContext = this.read()

    // Apply html context alone with config to each mode to perform checking logic.
  }
}

module = module.exports = Niffler