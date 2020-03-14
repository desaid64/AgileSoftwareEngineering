import path from 'path';
import webpack from 'webpack';

export default {
    entry: [
        path.join(__dirname,'/client/index.js')
    ],
    output: {
        path: '/',
        filename: 'bundle.js',
        publicPath:'/'
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    path.join(__dirname,'client'),
                    path.join(__dirname,'server/shared')
                ],
                use: [
                    {loader: 'babel-loader'},
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.js']
    }
}