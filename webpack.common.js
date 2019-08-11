const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    entry: {
        theme: './src/js/index.js',
    },
    resolve: {
        modules: [
            path.resolve(__dirname, 'src/js/libs'),
            path.resolve(__dirname, 'node_modules'),
        ],
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader']
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ],
    optimization: {
        splitChunks: {
            chunks(chunk) {
                return chunk.name === 'index';
            }
        }
    }
};
