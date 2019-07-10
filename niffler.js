"use strict"

const fs = require('fs')
const stream = require('stream')
const { Console } = require('console')

const {
  removeLineBreaks,
  predefinedRules,
  rules,
} = require('./rules')

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

    // @todo We should make a method to define new rules.
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
      if (fs.existsSync(output)) {
        this.output = fs.createWriteStream(output)
      }
    } else {
      // Input is neither stream readable nor string path. Echo error
      if (!(output instanceof stream.Writable) && !(output instanceof Console)) {
        throw new Error(
          'Invalid output source. Output should be one of the following: ' +
          '  - Valid file path' +
          '  - Writable stream' +
          '  - Console class'
        )
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

  write(results) {
    // writes the result to output dest.
    // There are three possible output dest.
    //   1. File path
    //   2. Writable stream
    //   3. console
    // We should first determine whether the output source is console or not
    // join the array of result to a single string
    const message = results.join('\\n')
  }

  async detect () {
    // If html context is not set externally, reads the the html context
    // from input source. If html context is set, its typically being
    // set by 'constraint' rule.
    const context = await this.read()

    // Apply html context alone with config to each mode to perform checking logic.
    // Iterate through rules.
    for (let rule of this.rules) {
      if (rule.mode === 'ConstrainContext') {
        // Initialize niffler. Set the new context for this new niffler.
      } else {
        this.result.push(predefinedRules[rule.mode](context, rule))
      }
    }

    // Now that we have list of results.
    this.write(this.result)
  }
}

module.exports = Niffler
Object.assign(Niffler, rules)
// Todo, make Niffler inconfigurable.