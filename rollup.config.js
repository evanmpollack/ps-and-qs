import terser from '@rollup/plugin-terser';

export default {
    input: 'lib/promisepool.js',
    output: [
        {
            file: './browser/promisepool.js',
            format: 'umd',
            name: 'PromisePool'
        },
        {
            file: './browser/promisepool.min.js',
            format: 'iife',
            name: 'PromisePool',
            plugins: [terser()]
        }
    ]
};