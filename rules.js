const rules = {
  TagExists: 'TagExists',
  HasNoAttrWithValue: 'HasNoAttrWithValue',
  TagNumberGreaterThan: 'TagNumberGreaterThan',
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
const getRegExpOfMatchedTags = tag => `<${tag}\\b[^>\/]*>(?:.*?)<\\/${tag}>`

/**
 * Matching html tag with "self closing".
 * For example:
 *   - <h1 />
 *   - <title />
 *
 * Although the above tags might not be valid, we still need to take the above tags in consideration.
 */
const getRegExpOfMatchedTagsSelfClosing = tag => `<${tag}[^>]+?\\/>`

/**
 * @todo We should figure out how this regex patterns works...
 */
const getRegExpOfUmatchedTagsWithAttrAndValue = ({ tag, attribute, value }) => `<${tag}(?=\\s|>)(?!(?:[^>=]|=(['"])(?:(?!\\1).)*\\1)*?\\s*?${attribute}\\s*?=\\s*?['"]${value}['"])[^>]*\\/?>`

/**
 * Match specific tag for at least once. Therefore, we can use a boolean
 * to indicate whether a given tag exists in the html context.
 */
function detectTagExists(context, config, output) {
  // Extract tag by regular expression
  const { tag } = config
  const reg = getRegExpOfMatchedTags(tag)
  const exists = (new RegExp(reg, 'g')).test(context)

  if (exists) {
    return `${config.tag} tag is present in the html.`
  }

  return `${config.tag} tag does not present in the html.`
}

/**
 * Get the number of specified tags that do not contain attribute and value.
 */
function detectHasNoAttrWithValue(context, config, output) {
  const { tag, attribute, value } = config
  const reg = getRegExpOfUmatchedTagsWithAttrAndValue({ tag, attribute, value })
  const matches = context.match(new RegExp(reg, 'g'))

  if (Array.isArray(matches) && matches.length > 0) {
    return `There are ${matches.length} <${tag}> tags do not contain attribute ${attribute}="${value}"`
  }

  return `All presenting <${tag}> tags contain ${attribute}="${value}"`
}

/**
 * Determine the number of appearences of a given tag is greater than
 * the specified limit.
 */
function detectTagNumberGreaterThan(context, config, output) {
  const { tag, limit } = config
  // Compose a regular expression to find the number of matched tags

  // Self-closing matches
  let reg = getRegExpOfMatchedTagsSelfClosing(tag)
  const scmatches = context.match(new RegExp(reg, 'g')) || []

  // Pattern with a closing tag
  reg = getRegExpOfMatchedTags(tag)
  const cmatches = context.match(new RegExp(reg, 'g')) || []

  const matchSum = scmatches.length + cmatches.length

  if (matchSum > limit) {
    return `The html has more than ${limit} <${tag}> tags.`
  } else if (matchSum === limit) {
    return `The html has exactly ${limit} <${tag}> tags.`
  } else {
    return `The number of <${tag}> tags is less than the ${limit} in the html.`
  }
}

const rulesDetectMap = {
  [rules.TagExists]: detectTagExists,
  [rules.HasNoAttrWithValue]: detectHasNoAttrWithValue,
  [rules.TagNumberGreaterThan]: detectTagNumberGreaterThan,
}

module.exports = {
  rules,
  rulesDetectMap,
  detectHasNoAttrWithValue,
  detectTagNumberGreaterThan,
  removeLineBreaks,
}