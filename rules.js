'use strict'

const rules = {
  TagExists: 'TagExists',
  HasNoAttr: 'HasNoAttr',
  HasNoAttrWithValue: 'HasNoAttrWithValue',
  TagNumberGreaterThan: 'TagNumberGreaterThan',
  ConstrainContext: 'ConstrainContext',
}

/**
 * Replace all line breaks and indentations in a given text.
 *
 * @todo Merge two replaces into one.
 */
const removeLineBreaks = text => text.replace(/^\s+/gm, '').replace(/\r?\n|\r/g, '')
/**
 * We should consider the following 2 cases:
 *  1. The tag might be ended with a closing tag: <title> </title>, <h1> </h1>
 *  2. The tag might be self-closing: <img />, <a />
 */

/**
  * Matching html tag that is enclosed by a "closing tag".
  * For example:
  *   - <h1></h1>
  *   - <title></title>
  */
const getRegExpOfMatchedTags = tag => `<${tag}\\b[^>\/]*\\/?>(?:.*?)(?:<\\/${tag}>)?`

/**
 * Matching html tag with "self closing".
 * For example:
 *   - <h1 />
 *   - <title />
 *
 * Although the above tags might not be valid, we still need to take the above tags in consideration.
 */

/**
 * Negtive look ahead on tag and attribute=value. In which case, given div(tag) class='yello':
 *   - <div class='yello' /> does not satisfy
 *   - <div /> satisfies
 *   - <div class="red" /> satisfies
 */
const getRegExpOfUmatchedTagsWithAttrAndValue = ({ tag, attribute, value }) => `<${tag}(?=\\s|>)(?!(?:[^>=]|=(['"])(?:(?!\\1).)*\\1)*?\\s*?${attribute}\\s*?=\\s*?['"]${value}['"])[^>]*\\/?>`

/**
 * Negtive look ahead on tag and attribute. In which case, given tag: div, attribute:class
 *   - <div class='yello' /> satisfies
 *   - <div /> not satisfy
 *   - <div class="red" /> satisfies
 */
const getRegExpOfUmatchedTagsWithAttr = ({ tag, attribute }) => `<${tag}(?=\\s|>)(?!(?:[^>=]|=(['"])(?:(?!\\1).)*\\1)*?\\s*?${attribute}\s*?=\\s*?['"](?:.*?)['"])[^>]*\\/?>`

/**
 * Match specific tag for at least once. Therefore, we can use a boolean
 * to indicate whether a given tag exists in the html context.
 */
function detectTagExists(context, config) {
  // Extract tag by regular expression
  const { tag } = config
  const reg = getRegExpOfMatchedTags(tag)
  const exists = (new RegExp(reg, 'g')).test(context)

  if (exists) {
    return `${config.tag} tag is present in the html.`
  }

  return `${config.tag} tag does not present in the html.`
}

function detectHasNoAttr(context, config) {
  const { tag, attribute } = config
  const reg = getRegExpOfUmatchedTagsWithAttr({ tag, attribute })
  const matches = context.match(new RegExp(reg, 'g')) || []

  if (matches.length > 0) {
    return `There are ${matches.length} <${tag}> tags do not contain attribute ${attribute}`
  }

  return `All existing <${tag}> contain ${attribute}.`
}

/**
 * Get the number of specified tags that do not contain attribute and value.
 */
function detectHasNoAttrWithValue(context = '', config) {
  const { tag, attribute, value } = config
  const reg = getRegExpOfUmatchedTagsWithAttrAndValue({ tag, attribute, value })
  const matches = context.match(new RegExp(reg, 'g')) || []

  if (matches.length > 0) {
    return `There are ${matches.length} <${tag}> tags do not contain attribute ${attribute}="${value}"`
  }

  return `All existing <${tag}> tags contain ${attribute}="${value}"`
}

/**
 * Determine the number of appearences of a given tag is greater than
 * the specified limit.
 *
 * @todo Proper tone on singular or plural.
 */
function detectTagNumberGreaterThan(context = '', config) {
  const { tag, limit } = config
  // Pattern with a closing tag
  const reg = getRegExpOfMatchedTags(tag)
  const cmatches = context.match(new RegExp(reg, 'g')) || []

  if (cmatches.length > limit) {
    return `The html has more than ${limit} <${tag}> tags`
  } else if (cmatches.length === limit) {
    return `The html has exactly ${limit} <${tag}> tags`
  } else {
    return `The number of <${tag}> tags in the html is less than the limit ${limit}`
  }
}

/**
 * Constraining the html context and continue calling niffler detect recursively
 *
 *   1. Extract the content in between specified tag
 *   2. Initialize a new of Niffler
 *   3. Set the html context of the Niffler
 *   4. Perform detect().
 */
function constrainContext (context = '', config) {
  const { tag } = config
  const re = `<${tag}>(.*?)<\\/${tag}>`
  const [,newContext = []] = context.match(new RegExp(re))
  return newContext
}

const predefinedRules = {
  [rules.TagExists]: detectTagExists,
  [rules.HasNoAttr]: detectHasNoAttr,
  [rules.HasNoAttrWithValue]: detectHasNoAttrWithValue,
  [rules.TagNumberGreaterThan]: detectTagNumberGreaterThan,
  [rules.ConstrainContext]: constrainContext,
}

module.exports = {
  rules,
  predefinedRules,

  detectTagExists,
  detectHasNoAttr,
  detectHasNoAttrWithValue,
  detectTagNumberGreaterThan,
  constrainContext,

  removeLineBreaks,
}