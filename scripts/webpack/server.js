const { siteName } = require('../frontend/config');

module.exports = () => ({
    entry: {
        [`${siteName}.server`]: './src/app/server.ts',
    },
    output: {
        filename: `[name].js`,
        chunkFilename: `[name].js`,
        libraryTarget: 'commonjs2',
        pathinfo: true,
    },
    target: 'node',
    optimization: {
        minimize: false,
        namedModules: true,
        runtimeChunk: false,
    },
    externals: [
        require('webpack-node-externals')({
            whitelist: [/^@guardian/],
        }),
        (context, request, callback) => {
            return request.endsWith('manifest.json')
                ? callback(null, `commonjs ${request}`)
                : callback();
        },
        (context, request, callback) => {
            return request.endsWith('manifest.legacy.json')
                ? callback(null, `commonjs ${request}`)
                : callback();
        },
    ],

    module: {
        rules: [
            {
                test: /(\.tsx|\.js|\.ts)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                // TODO: remove @babel/preset-react once we stop using JSX in server folder
                                '@babel/preset-react',
                                [
                                    '@babel/preset-env',
                                    {
                                        targets: {
                                            node: 'current',
                                        },
                                    },
                                ],
                            ],
                        },
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: 'tsconfig.build.json',
                            transpileOnly: true,
                        },
                    },
                ],
            },
            // TODO: find a way to remove
            {
                test: /\.svg$/,
                use: ['desvg-loader/react', 'svg-loader'],
            },
        ],
    },
});
