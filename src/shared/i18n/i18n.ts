import path from 'path'
import i18n from 'i18n'

export const i18nConfigure = () => {
  // NOTE: This project runs many scripts via `tsx` (ESM). In that mode, `__dirname`
  // may not behave as expected, leading to missing locale files (i18n.__ => undefined).
  // Using process.cwd() keeps things consistent for npm scripts and server runs while
  // still mirroring the server's locale directory split for development vs production.
  const repoRoot = process.cwd()
  const isProduction = process.env.NODE_ENV === 'production'
  i18n.configure({
    directory: isProduction
      ? path.join(repoRoot, 'locales', 'result')
      : path.join(repoRoot, 'locales'),
    locales: isProduction ? ['en', 'br'] : ['en'],
    defaultLocale: 'en',
    retryInDefaultLocale: true,
    updateFiles: false,
    logWarnFn: (msg: unknown) => console.warn('WARN:', msg),
    logErrorFn: (msg: unknown) => console.error('ERROR:', msg)
  })
  i18n.setLocale('en')
}
