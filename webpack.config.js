var webpack = require('webpack')

module.exports = {
    entry: './src/entry.js',

    output: {
        path: __dirname + '/dist',
        filename: 'h5uploader.js'
    },

    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: 'style!css'
            },
            {
                // use babel-loader for *.js files
                test: /\.js$/,
                loader: 'babel',
                // important: exclude files in node_modules
                // otherwise it's going to be really slow!
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                loaders: ["style-loader", "css-loader", "sass-loader"]
            }
        ]
    },

    externals: {
        jquery: 'window.$',
        navigator : 'window.navigator',
        webkitURL : 'window.webkitURL'
    }
};