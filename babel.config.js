module.exports = {
  env: {
    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: 'current',
            },
          },
        ],
        '@babel/preset-typescript',
      ],
      plugins: [
        [
          '@babel/plugin-transform-typescript',
          {
            allowNamespaces: true,
            allowDeclareFields: true,
          },
        ],
        '@babel/plugin-transform-modules-commonjs',
      ],
    },
  },
}
