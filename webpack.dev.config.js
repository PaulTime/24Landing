const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

module.exports = [
    {
        entry: "./src/client/index.js",
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: "client.js",
        },
        watch: true,
        devtool: 'eval',
        resolve: {
            modules: [
                "src",
                "node_modules"
            ],
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: "babel-loader"
                },
                {
                    test: /\.(sa|sc|c)ss$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: [
                            'css-loader',
                            // {
                            //     loader: 'postcss-loader',
                            //     options: {
                            //         config: {
                            //             path: path.resolve(__dirname, './postcss.config.js'),
                            //         },
                            //     }
                            // }
                        ]
                    })
                },
                {
                    test: /\.(png|jpg|gif|svg)$/,
                    exclude: /(\/fonts)/,
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]',
                        context: 'src',
                    }
                },
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                filename: 'page.html',
                template: 'src/server/template.html',
                inlineSource: '.css$'
            }),
            new ExtractTextPlugin({
                filename: 'client.css',
                allChunks: true,
            }),
            new HtmlWebpackInlineSourcePlugin(),
            new CopyWebpackPlugin([{ from: 'src/static', to: 'static' }]),
        ]
    },
    {
        entry: {
            server: "./src/server/index.js"
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: "[name].js",
        },
        target: "node",
        externals: [nodeExternals({
            // load non-javascript files with extensions, presumably via loaders
            whitelist: [/\.(?!(?:jsx?|json)$).{1,5}$/i],
        }),],
        watch: true,
        devtool: 'eval',
        node: {
            __dirname: false
        },
        resolve: {
            modules: [
                "src",
                "node_modules"
            ],
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: "babel-loader"
                },
                {
                    test: /\.(sa|sc|c)ss$/,
                    use: 'null-loader'
                },
                {
                    test: /\.(png|jpg|gif|svg)$/,
                    exclude: /(\/fonts)/,
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]',
                        context: 'src',
                        emitFile: false,
                    }
                },
            ]
        }
    }
];
