const path = require('path')

const Niffler = require('../niffler')

describe('niffler functionalities', () => {
  test('initialize niffler instance and reads text file successfully', async () => {
    const niffler = new Niffler({
      input: path.resolve(__dirname, './files/index.html'),
      output: path.resolve(__dirname, './files/output.txt'),
    })

    const content = await niffler.read()
    expect(content.length).toBeGreaterThan(1)
  })

  test.only('output the result to output', async () => {
    // console.log('triggered', Niffler.TagExists)
    // console.log('Niffler', Niffler)

    const niffler = new Niffler({
      input: path.resolve(__dirname, './files/index.html'),
      output: path.resolve(__dirname, './files/output.txt'),
      rules: [
        {
          mode: Niffler.HasNoAttrWithValue, // Detect the number of img tags without specifying "alt" attribute
          tag: 'img',
          attribute: 'alt',
          value: 'helloworld',
        },
      ],
    })

    await niffler.detect()
  })
})