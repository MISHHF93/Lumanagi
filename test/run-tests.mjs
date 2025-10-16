import { spawn } from 'node:child_process'
import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const testExtensions = ['.test.ts', '.test.tsx', '.test.js', '.test.jsx']
const ignoredDirs = new Set(['node_modules', 'dist', 'build', '.git'])

const isTestFile = (filename) =>
  testExtensions.some((ext) => filename.toLowerCase().endsWith(ext))

async function collectTests(startDir) {
  const files = []
  async function walk(currentDir) {
    let entries
    try {
      entries = await readdir(currentDir, { withFileTypes: true })
    } catch (error) {
      if ((error.code === 'ENOENT' || error.code === 'ENOTDIR')) {
        return
      }
      throw error
    }

    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (ignoredDirs.has(entry.name)) {
          continue
        }
        await walk(path.join(currentDir, entry.name))
      } else if (entry.isFile()) {
        const filepath = path.join(currentDir, entry.name)
        if (isTestFile(filepath)) {
          files.push(filepath)
        }
      }
    }
  }

  await walk(startDir)
  return files
}

async function main() {
  const searchRoots = ['src']
  const discovered = []

  for (const relative of searchRoots) {
    const absolute = path.join(projectRoot, relative)
    const tests = await collectTests(absolute)
    discovered.push(...tests)
  }

  if (discovered.length === 0) {
    console.warn('No test files found.')
    return
  }

  discovered.sort((a, b) => a.localeCompare(b))

  const args = [
    '--test',
    '--test-reporter',
    process.env.NODE_TEST_REPORTER ?? 'spec',
    '--import',
    './test/register-loader.mjs',
    ...discovered.map((file) => path.relative(projectRoot, file))
  ]

  const child = spawn(process.execPath, args, {
    cwd: projectRoot,
    stdio: 'inherit',
    env: process.env,
  })

  child.on('exit', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal)
      return
    }
    process.exitCode = code ?? 1
  })

  child.on('error', (error) => {
    console.error('Failed to start test runner:', error)
    process.exitCode = 1
  })
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
