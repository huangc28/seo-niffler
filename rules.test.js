const {
  rules,
  rulesDetectMap,
  detectHasNoAttrWithValue,
  detectTagNumberGreaterThan,
  removeLineBreaks,
} = require('./rules')

test('Replace all line breaks within a context', () => {
  const context = `
    <head>
      <title> shopback lite </title>
      <h1> shopback </h1>
      <h2> great deal </h2>
    </head>
  `

  const inlined = removeLineBreaks(context)
  expect(inlined).toBe('<head><title> shopback lite </title><h1> shopback </h1><h2> great deal </h2></head>')

})

describe('Detect tag exists rules', () => {
  const detectTagExists = rulesDetectMap[rules.TagExists]

  test('Assert that title tag presents in html', () => {
    // Create a region of html script
    const context = removeLineBreaks(`
      <head>
        <title> shopback lite </title>
        <h1> shopback </h1>
        <h2> great deal </h2>
      </head>
    `)

    const config = {
      tag: 'title',
    }

    // Output is suppose to be a writable stream
    const result = detectTagExists(context, config, {})

    expect(result).toBe('title tag is present in the html.')
  })

  test('Assert title tag is not present in the html', () => {
    const context = removeLineBreaks(`
      <head>
        <h1> shopback </h1>
        <h2> great deal </h2>
      </head>
    `)

    const config = {
      tag: 'title'
    }

    const result = detectTagExists(context, config, {})

    expect(result).toBe('title tag does not present in the html.')
  })
})

describe('Find matching pattern that a given tag does not contain specific attribute and value', () => {
  test('get correct number of matching pattern', () => {
    const context = removeLineBreaks(`
      <html>
        <img alt="hello world"/>
        <img alt='hello world'/>
        <img src="nihao"/>
        <img alt='hello world' src='nihao'/>
        <img />
      </html>
    `)

    const config = {
      tag: 'img',
      attribute: 'alt',
      value: 'hello world',
    }

    const result = detectHasNoAttrWithValue(context, config, {})

    expect(result).toBe(`There are 2 <img> tags do not contain attribute alt="hello world"`)
  })

  test('all img tags statisfy the specified pattern', () => {
    const context = removeLineBreaks(`
      <html>
        <img alt="hello world" />
        <img alt="hello world" />
        <img src="http://ab.com/hello.png" alt="hello world" />
        <img alt="hello world" src="http://ab.com/sample.png" />
        <img alt="hello world"src="http://ab.com/sample.png" />
      </html>
    `)

    const config = {
      tag: 'img',
      attribute: 'alt',
      value: 'hello world',
    }

    const result = detectHasNoAttrWithValue(context, config, {})

    expect(result).toBe('All presenting <img> tags contain alt="hello world"')
  })
})

describe('Detect the number of tag appearances', () => {
  test('html has more than 1 <h1> tags', () => {
    const context = removeLineBreaks(`
      <html>
        <h1 />
        <h1 />
        <h1> hello shoppers </h1>
        <div>
          shopback
        </div>
      </html>
    `)

    const config = { tag: 'h1', limit: 1 }

    const result = detectTagNumberGreaterThan(context, config)

    expect(result).toBe('The html has more than 1 <h1> tags')
  })

  test('html has exactly 1 <h1> tag', () => {
    const context = removeLineBreaks(`
      <html>
        <div>
          <h1> hello shoppers </h1>
        </div>
        <div>
          shopback
        </div>
      </html>
    `)

    const config = { tag: 'h1', limit: 1 }

    const result = detectTagNumberGreaterThan(context, config)

    expect(result).toBe('The html has exactly 1 <h1> tags')
  })

  test('html has exactly 1 <h1> tag with self closing', () => {
    const context = removeLineBreaks(`
      <html>
        <div>
          <h1 />
        </div>
        <div>
          shopback
        </div>
      </html>
    `)

    const config = { tag: 'h1', limit: 1 }

    const result = detectTagNumberGreaterThan(context, config)

    expect(result).toBe('The html has exactly 1 <h1> tags')
  })

  test('html has no <h1> tag', () => {
    const context = removeLineBreaks(`
      <html>
        <div>
          shopback
        </div>
      </html>
    `)

    const config = { tag: 'h1', limit: 1 }

    const result = detectTagNumberGreaterThan(context, config)

    expect(result).toBe('The number of <h1> tags in the html is less than the limit 1')
  })
})
