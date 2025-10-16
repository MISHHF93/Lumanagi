import { readFile, access } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { transform } from 'esbuild'

const loaders = new Map([
  ['.jsx', 'jsx'],
  ['.tsx', 'tsx'],
  ['.ts', 'ts']
])

const projectRoot = path.resolve(fileURLToPath(new URL('../', import.meta.url)))
const extensionCandidates = ['', '.js', '.jsx', '.ts', '.tsx', '/index.js', '/index.jsx', '/index.ts', '/index.tsx']

const fileExists = async (filepath) => {
  try {
    await access(filepath)
    return true
  } catch {
    return false
  }
}

const resolveFromSpecifier = async (specifier, parentURL) => {
  let basePath
  if (specifier === '@testing-library/react') {
    const shimPath = path.resolve(projectRoot, 'test/rtl-shim.tsx')
    return pathToFileURL(shimPath).href
  }

  if (specifier.startsWith('@/')) {
    basePath = path.resolve(projectRoot, 'src', specifier.slice(2))
  } else if (specifier.startsWith('./') || specifier.startsWith('../')) {
    const parentPath = parentURL ? path.dirname(fileURLToPath(parentURL)) : projectRoot
    basePath = path.resolve(parentPath, specifier)
  } else if (specifier.startsWith('/')) {
    basePath = path.resolve(projectRoot, specifier.slice(1))
  } else {
    return null
  }

  for (const suffix of extensionCandidates) {
    const candidate = basePath + suffix
    if (await fileExists(candidate)) {
      return pathToFileURL(candidate).href
    }
  }

  return null
}

export async function resolve(specifier, context, defaultResolve) {
  const resolved = await resolveFromSpecifier(specifier, context.parentURL)
  if (resolved) {
    return { url: resolved, shortCircuit: true }
  }

  return defaultResolve(specifier, context, defaultResolve)
}

export async function load(url, context, defaultLoad) {
  const extension = Array.from(loaders.keys()).find((ext) => url.endsWith(ext))
  if (!extension) {
    return defaultLoad(url, context, defaultLoad)
  }

  const filepath = fileURLToPath(url)
  const source = await readFile(filepath, 'utf8')
  const loader = loaders.get(extension)
  const result = await transform(source, {
    loader,
    format: 'esm',
    jsx: 'automatic',
    sourcemap: 'inline',
    target: 'es2020'
  })

  return {
    format: 'module',
    source: result.code,
    shortCircuit: true
  }
}
