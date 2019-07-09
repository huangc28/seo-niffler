const path = require('path')

const Niffler = require('../niffler')

describe('Niffler functionalities', () => {
  test('Initialize niffler instance and reads text file successfully', async () => {
    const niffler = new Niffler({
      input: path.resolve(__dirname, './files/index.html'),
      output: path.resolve(__dirname, './files/output.txt'),
    })

    const content = await niffler.read()
    expect(content.length).toBeGreaterThan(1)
  })
})