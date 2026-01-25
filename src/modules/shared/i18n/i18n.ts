import path from 'path'
import i18n from 'i18n'

export const i18nConfigure = () => {
  const repoRoot = path.resolve(__dirname, '../../../../')
  i18n.configure({
    directory: path.join(repoRoot, 'locales'),
    locales: ['en', 'br'],
    defaultLocale: 'en',
    updateFiles: false,
    logWarnFn: (msg: unknown) => console.warn('WARN:', msg),
    logErrorFn: (msg: unknown) => console.error('ERROR:', msg)
  })
  i18n.setLocale('en')
}
