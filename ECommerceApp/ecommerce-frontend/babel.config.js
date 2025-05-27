module.exports = {
  presets: [
    ['@babel/preset-env', {
      modules: 'auto',
      targets: {
        node: 'current',
      },
    }],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
  ],
};