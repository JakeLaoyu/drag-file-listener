import babel from 'rollup-plugin-babel'

// rollup.config.js
export default {
  input: 'src/index.js',
  output: [
    {
      file: 'libs/index.js',
      format: 'cjs'
    },
    {
      file: 'libs/index.esm.js',
      format: 'esm'
    }
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
}
