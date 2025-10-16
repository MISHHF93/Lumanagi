import { register } from 'node:module'
import { pathToFileURL } from 'node:url'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const projectRootPath = projectRoot.endsWith(path.sep) ? projectRoot : `${projectRoot}${path.sep}`
const projectRootUrl = pathToFileURL(projectRootPath)

register('./test/esbuild-loader.mjs', projectRootUrl)
