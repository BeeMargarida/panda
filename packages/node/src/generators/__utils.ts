import { writeFile } from 'fs-extra'
import { createRequire } from 'module'
import outdent from 'outdent'
import { dirname, join } from 'path'

function withNote(text: string) {
  return outdent`
  /**
   * This is an autogenerated file created by the Panda 🐼.
   * Do not edit this file directly.
   */
  
  ${text}
  `
}

export function writeFileWithNote(path: string, text: string) {
  return writeFile(path, withNote(text))
}

const __require = createRequire(import.meta.url)

export function getEntrypoint(pkg: string, file: { dev: string; prod?: string }) {
  const { dev, prod = dev } = file
  const entry = __require.resolve(pkg)

  const isDist = entry.includes('dist')
  const isType = pkg.includes('/types')

  if (isType) {
    return join(dirname(entry), dev)
  }

  if (!isDist) {
    return join(dirname(entry), 'src', dev)
  }

  return join(dirname(entry), prod)
}
