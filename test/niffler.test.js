const path = require('path')
const fs = require('fs')

const Niffler = require('../niffler')


describe('niffler functionalities', () => {
  const createNiffler = rules => {
    return new Niffler({
      input: path.resolve(__dirname, './files/index.html'),
      output: path.resolve(__dirname, './files/output.txt'),
      rules,
    })
  }

  test('initialize niffler instance and reads text file successfully', async () => {
    const niffler = createNiffler([])
    const content = await niffler.read()
    expect(content.length).toBeGreaterThan(1)
  })

  test('output the result to output', async () => {
    const niffler = createNiffler([
      {
        mode: Niffler.HasNoAttrWithValue, // Detect the number of img tags without specifying "alt" attribute
        tag: 'img',
        attribute: 'alt',
        value: 'helloworld',
      },
    ])

    await niffler.detect()
    fs.unlinkSync(path.resolve(__dirname, './files/output.txt'))
  })

  test('constraining html, perform checking logic against the constraint', () => {

  })
})