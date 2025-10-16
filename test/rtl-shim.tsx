import type { ReactElement } from 'react'
import { renderToString } from 'react-dom/server'

type Matcher = string | RegExp

type RoleOptions = {
  name?: Matcher
  level?: number
}

type RenderResult = {
  container: { innerHTML: string }
  rerender: (ui: ReactElement) => void
  unmount: () => void
}

let currentMarkup = ''

const normalize = (value: string) => value.replace(/\s+/g, ' ').trim()

const textMatches = (text: string, matcher: Matcher) => {
  if (typeof matcher === 'string') {
    return normalize(text).toLowerCase().includes(matcher.toLowerCase())
  }
  return matcher.test(normalize(text))
}

const extractTagText = (tag: string, markup: string) => {
  const regex = new RegExp(`<${tag}[^>]*>([\s\S]*?)<\\/${tag}>`, 'gi')
  const results: string[] = []
  let match
  while ((match = regex.exec(markup)) !== null) {
    results.push(match[1])
  }
  return results
}

const getHeadingTags = (level?: number) => {
  if (level && level >= 1 && level <= 6) {
    return [`h${level}`]
  }
  return ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
}

const queryByText = (matcher: Matcher) => {
  if (!currentMarkup) return null
  return textMatches(currentMarkup, matcher) ? matcher : null
}

const getByText = (matcher: Matcher) => {
  if (!currentMarkup) {
    throw new Error('render() must be called before accessing screen queries')
  }
  if (queryByText(matcher)) {
    return matcher
  }
  throw new Error(`Unable to find text: ${matcher}`)
}

const getByRole = (role: string, options: RoleOptions = {}) => {
  if (!currentMarkup) {
    throw new Error('render() must be called before accessing screen queries')
  }

  if (role !== 'heading') {
    throw new Error(`Role ${role} is not supported in this minimal test environment`)
  }

  const tags = getHeadingTags(options.level)
  for (const tag of tags) {
    const texts = extractTagText(tag, currentMarkup)
    for (const text of texts) {
      if (options.name ? textMatches(text, options.name) : true) {
        return matcherFromText(text)
      }
    }
  }

  throw new Error(`Unable to find role="${role}"${options.name ? ` with name ${options.name}` : ''}`)
}

const matcherFromText = (text: string) => normalize(text)

export const screen = {
  getByText,
  queryByText,
  getByRole,
}

export const render = (ui: ReactElement): RenderResult => {
  currentMarkup = renderToString(ui)
  const container = { innerHTML: currentMarkup }

  return {
    container,
    rerender: (nextUi) => {
      currentMarkup = renderToString(nextUi)
      container.innerHTML = currentMarkup
    },
    unmount: () => {
      currentMarkup = ''
      container.innerHTML = ''
    },
  }
}

export const cleanup = () => {
  currentMarkup = ''
}

type CleanupFn = () => void

declare const afterEach: undefined | ((fn: CleanupFn) => void)

if (typeof afterEach === 'function') {
  afterEach(() => {
    cleanup()
  })
}
