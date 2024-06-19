import terser from '@rollup/plugin-terser';

export default {
    input: './src/promisepool.js',
    output: [
        {
            file: './dist/promisepool.js',
            format: 'esm',
            name: 'PromisePool'
        },
        {
            file: './dist/promisepool.cjs',
            format: 'cjs',
            name: 'PromisePool'
        },
        {
            file: './dist/promisepool.min.js',
            format: 'iife',
            name: 'PromisePool',
            plugins: [terser()]
        }
    ]
};