const path = require('path');

module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
  },
  addons: {},
  mini: {
    compile: {
      exclude: [
        path.resolve(__dirname, 'src/utils/request.js')
      ]
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {}
      }
    }
  }
};
