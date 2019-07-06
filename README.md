# seo-niffler
Tool to detect SEO defects in your html scripts.

# Config

The config provided to `Niffler` can be either an object specifying a single rule order array of object that specifies multiple rules.

## Input source

The input source can be either **file path** or [readable stream](https://jscomplete.com/learn/node-beyond-basics/node-streams).


```js
const nif = new Niffler({
  input: '/path/to/html',
})

// Or

const nif = new Niffler({
  input: fs.createReadStream('/path/to/html')
})
```
## Define niffler rules

```js

// You can specify single rule by providing rule object.
const nif = new Niffler({
  input: ...,
  rules: {
    mode: Niffler.HasNoAttr,
    tag: 'img',
    attribute: 'alt',
  },
})

// Or, you can specify multiple rules by providing array of rule objects.
const nif = new Niffler({
  input: ...,
  rules: [
    {
      mode: Niffler.HasNoAttr, // Detect the number of img tags without specifying "alt" attribute
      tag: 'img',
      attribute: 'alt',
    },
    {
      mode: Niffler.HasNoAttr, // Detect the number of a tags without specifying "rel" attribute
      tag: 'a',
      attribute: 'rel',
    }
  ]
})
```

## Apply rules only within constraint tag region

You can also apply rules within a specified tag region instead of applying rules globally.

```js
const nif = new Niffler({
  input: ...,
  rules: {
    mode: Niffler.Constraint, // Constrains the following rules within the provided context. In this case is <head> ... </head>.
    tag: 'head',
    rules: [
      {
        mode: Niffler.TagExists, // Check if <title> </title> exists at least once.
        tag: 'title',
      },
      {
        mode: Niffler.HasNoAttrWithValue,
        tag: 'meta',
        attribute: 'name',
        value: 'description',
      }
      {
        mode: Niffler.HasNoAttrWithValue,
        tag: 'meta',
        attribute: 'name',
        value: 'keywords',
      }
    ]
  }
})
```

## Check the number of tag existence within constraint.

```js
const nif = new Niffler({
  input: ...
  rules: [
    {
      mode: Niffler.TagExistenceGreaterThan,
      limit: 15,
      tag: 'strong'
    },
    {
      mode: Niffler.TagExistenceGreaterThan,
      limit: 15,
      tag: 'h1'
    },
  ]
})
```