"use strict"

const fs = require('fs')
const stream = require('stream')

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
      }
    }

    // Input is neither stream readable nor string path. Echo error
    if (!(input instanceof stream.Readable)) {
      throw new Error('Invalid Input source. Input is neither string path nor stream readable.')
    }

    // Input must be stream readable
    this.input = config.input
  }

  initOutput(output) {
    if (typeof output === 'string') {
      // We should check whether a given input is a valid path
      if (fs.existsSync(output)) {
        this.output = fs.createWriteStream(output)
      }
    }

    // Input is neither stream readable nor string path. Echo error
    if (!(output instanceof stream.Writable)) {
      throw new Error('Invalid output source. Output is neither string path nor stream writable.')
    }

    // Input must be stream readable
    this.output = config.output
  }

  detect () {
    // Read html context from stream readable

    // Apply html context alone with config to each mode to perform checking logic.
  }
}

module = module.exports = Niffler