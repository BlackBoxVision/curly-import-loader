var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: [path.join(__dirname, './dummy/dummyImport.js')],
    output: {
        path: path.join(__dirname, './dist'),
        filename: 'bundle.js'
    },
    resolveLoader: {
        alias: {
            "curly-loader": path.join(__dirname, "../dist/curlyLoader.js")
        }
    },
    module: {
        loaders: [
            {
                test: /.js?$/,
                loaders: ['babel-loader', 'curly-loader'],
                exclude: /node_modules/
            }
        ]
    }
};
