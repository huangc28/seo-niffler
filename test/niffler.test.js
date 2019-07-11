const path = require('path')
const fs = require('fs')
const { Console } = require('console')

const Niffler = require('../niffler')


describe('SEO niffler', () => {
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

  test('initialize niffler instance with Console as output to terminal', async () => {
    const customConsole = new Console(process.stdout, process.stderr)
    const niffler = new Niffler({
      input: path.resolve(__dirname, './files/index.html'),
      output: customConsole,
      rules: [
        {
          mode: Niffler.HasNoAttrWithValue,
          tag: 'img',
          attribute: 'alt',
          value: 'hello world',
        }
      ],
    })

    const message = await niffler.detect()
    expect(message).toBe('There are 2 <img> tags do not contain attribute alt="hello world"')
  })

  test('output the result to output', async () => {
    const niffler = createNiffler([
      {
        mode: Niffler.HasNoAttrWithValue, // Detect the number of img tags without specifying "alt" attribute
        tag: 'img',
        attribute: 'alt',
        value: 'helloworld',
      },
      {
        mode: Niffler.HasNoAttr, // Detect the number of img tags without specifying "alt" attribute
        tag: 'img',
        attribute: 'alt',
      }
    ])

    await niffler.detect()

    // Read file content from output dest
    const output = fs.readFileSync(path.resolve(__dirname, './files/output.txt'), { encoding: 'utf8' })
    expect(output).toBe(
      'There are 3 <img> tags do not contain attribute alt="helloworld"\r\n' +
      'There are 1 <img> tags do not contain attribute alt'
    )

    fs.unlinkSync(path.resolve(__dirname, './files/output.txt'))
  })

  test('constraining html, perform checking logic against the constraint', async () => {
    const niffler = createNiffler([
      {
        mode: Niffler.ConstrainContext,
        tag: 'head',
        rules: [
          {
            mode: Niffler.ConstrainContext,
            tag: 'div',
            rules: [
              {
                mode: Niffler.TagExists,
                tag: 'img',
              },
              {
                mode: Niffler.HasNoAttrWithValue,
                tag: 'img',
                attribute: 'alt',
                value: 'hello world',
              }
            ]
          }
        ]
      }
    ])

    await niffler.detect()
    const output = fs.readFileSync(path.resolve(__dirname, './files/output.txt'), { encoding: 'utf8' })
    expect(output).toBe(
      'img tag is present in the html.\r\n' +
      'There are 1 <img> tags do not contain attribute alt="hello world"'
    )

    fs.unlinkSync(path.resolve(__dirname, './files/output.txt'))
  })
})