var path = require('path');
var webpack = require('webpack');
var postcss = require('postcss');

module.exports = {
    mode: 'development',
    entry: './test/build/index.js',
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "bundle.js",
        publicPath: "./build/"
    },
    bail: true,
    module: {
        rules: [
            { test: /\.css$/, use: [
                'style-loader',
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        plugins: [
                            postcss.plugin('delete-tilde', function() {
                                return function (css) {
                                    css.walkAtRules('import', function(rule) {
                                        rule.params = rule.params.replace('~', '');
                                    });
                                };
                            }),
                            postcss.plugin('prepend', function() {
                                return function(css) {
                                    css.prepend("@import '@jupyter-widgets/controls/css/labvariables.css';")
                                }
                            }),
                            require('postcss-import')(),
                            require('postcss-cssnext')()
                        ]
                    }
                }
            ]},
            // jquery-ui loads some images
            { test: /\.(jpg|png|gif)$/, use: 'file-loader' },
            // required to load font-awesome
            { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, use: {
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    mimetype: 'application/font-woff'
                }
            }},
            { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, use: {
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    mimetype: 'application/font-woff'
                }
            }},
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, use: {
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    mimetype: 'application/octet-stream'
                }
            }},
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, use: 'file-loader' },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use: {
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    mimetype: 'image/svg+xml'
                }
            }}
        ]
    },
    plugins: [
      new webpack.DefinePlugin({
        // Needed for Blueprint. See https://github.com/palantir/blueprint/issues/4393
        'process.env': '{}',
        // Needed for various packages using cwd(), like the path polyfill
        'process.cwd': '() => "/"',
        // Needed for various packages using argv(), like JupyterLab's getOption function
        'process.argv': '[]',
      }),
    ],
}
