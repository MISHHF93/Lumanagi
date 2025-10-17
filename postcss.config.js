import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

const tailwindImportAlias = () => ({
  postcssPlugin: 'tailwind-import-alias',
  AtRule(atRule) {
    if (atRule.name !== 'import') return

    const match = atRule.params.match(/['"]tailwindcss\/(base|components|utilities)['"]/)
    if (!match) return

    atRule.name = 'tailwind'
    atRule.params = match[1]
  },
})

tailwindImportAlias.postcss = true

export default {
  plugins: [tailwindImportAlias(), tailwindcss(), autoprefixer()],
}
