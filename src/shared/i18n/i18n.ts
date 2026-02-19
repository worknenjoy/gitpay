import path from 'path'
import i18n from 'i18n'

export const i18nConfigure = () => {
  // NOTE: This project runs many scripts via `tsx` (ESM). In that mode, `__dirname`
  // may not behave as expected, leading to missing locale files (i18n.__ => undefined).
  // Using process.cwd() keeps things consistent for npm scripts and server runs.
  const repoRoot = process.cwd()
  i18n.configure({
    directory: path.join(repoRoot, 'locales'),
    locales: ['en', 'br', 'pt', 'es'],
    defaultLocale: 'en',
    updateFiles: false,
    logWarnFn: (msg: unknown) => console.warn('WARN:', msg),
    logErrorFn: (msg: unknown) => console.error('ERROR:', msg)
  })
  i18n.setLocale('en')
}
