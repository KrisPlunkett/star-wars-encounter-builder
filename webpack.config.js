const webpack = require('webpack');
const fs = require('fs');
const build = require('./recruiting_project/frontend/src/utils/build');
const path = require('path');
const glob = require('glob');
const stylus = require('stylus');
const TerserPlugin = require('terser-webpack-plugin');


// Import any plugins
const CircularDependencyPlugin = require('circular-dependency-plugin');
const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');


// Build any paths we need
const sourcePath = path.resolve(__dirname, 'recruiting_project/frontend/src');
const stylePath = path.resolve(__dirname, 'recruiting_project/frontend/style');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const buildPath = path.resolve(__dirname, 'recruiting_project/frontend/static/frontend/build');


// Method that will get javascript entry points for the ambition recruiting project
const getAmbitionJavascriptEntries = () => {
    // Build the javascript pages
    let pages = glob.sync(path.resolve(sourcePath, '*/*.js'));
    let entries = {};
    let modifiedSourcePath = sourcePath.replace(/\\/g, '/');
    pages.forEach((page) => {
        // Get the page name
        let pageName = page.split(modifiedSourcePath + '/')[1].replace('.js', '');

        // Add to the entries
        entries[pageName] = page;
    });

    // Return the entries
    return entries;
};


const filterEntriesForPages = (entries, applicationPageMap) => {
    // If there are not any pages we do not need to do anything
    if (!Object.keys(applicationPageMap).length) {
        return entries;
    }

    // Filter out any apps that do not match
    let filteredEntries = {};

    // Loop over each entry to see if we care about watching and building it
    Object.keys(entries).forEach(key => {
        // Split the key into parts
        let parts = key.split('/');

        // If the parts length is only one we know this is a core file
        if (parts.length === 1 || parts[0] === 'core') {
            filteredEntries[key] = entries[key];
            return true;
        }

        // Get the app and page associated with the entry point
        let appName = parts[0];
        let pageName = parts[1].replace('.bundle.js', '');

        // Check if we care about this app
        if (applicationPageMap[appName] === undefined) {
            return false;
        }

        // Check if we care about this page
        if (!applicationPageMap[appName].length || applicationPageMap[appName].indexOf(pageName) !== -1) {
            filteredEntries[key] = entries[key];
            return true;
        }
    });
    return filteredEntries;
};


// Method that will get our vendor entries
const getVendorEntries = () => {
    return {
        'vendor.bundle.js': [
            path.resolve(nodeModulesPath, '@babel/polyfill/dist/polyfill.min.js'),
            path.resolve(nodeModulesPath, 'mdn-polyfills/Element.prototype.matches.js'),
            path.resolve(nodeModulesPath, 'formdata-polyfill/formdata.min.js'),
        ]
    };
};


// Export the module
module.exports = (env, argv) => {
    // Ensure that we have an env
    argv = argv || {}
    argv.env = argv.env || {};

    // Setup some useful variables for our environment
    let isDevelopment = argv.mode === 'development';
    let isProduction = !isDevelopment;

    // Get the javascript entries
    let entries = filterEntriesForPages(
        getAmbitionJavascriptEntries(),
        build.getPagesFromArguments(argv.env.page)
    );

    // Build the config
    let config = {
        entry: Object.assign(
            {
                'bootstrap': path.resolve(sourcePath, 'bootstrap.js')
            },
            entries,
        ),
        devtool: isDevelopment ? 'cheap-module-eval-source-map' : undefined,
        devServer: {
            contentBase: buildPath,
            overlay: {
                warnings: true,
                errors: true
            }
        },
        optimization: {
            minimize: isProduction,
            minimizer: [
                new TerserPlugin({
                    parallel: true,
                })
            ],
            removeAvailableModules: isProduction,
            removeEmptyChunks: isProduction,
            splitChunks: !argv.env.page ? {
                cacheGroups: {
                    common: {
                        test: /[\\/]node_modules|react-ui|recruiting_project\/core\/.*[\\/]/,
                        name: 'common',
                        chunks: 'all',
                    }
                }
            } : {}
        },
        output: {
            filename: '[name].bundle.js',
            chunkFilename: `[name].bundle.js`,
            path: buildPath,
            pathinfo: isProduction,
            publicPath: '/collectstatic/frontend/build/'
        },
        resolve: {
            modules: [
                'node_modules',
                sourcePath,
            ],
            extensions: ['.js', '.styl'],
            symlinks: isProduction,
            cacheWithContext: isProduction
        },
        module: {
            rules: [{
                test: /.js$/,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: '.buildcache',
                    cacheCompression: false,
                },
                include: [
                    sourcePath,
                ],
                exclude: [
                    /node_modules/,
                    buildPath
                ]
            }, {
                test: /.(styl|css)$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            url: false
                        }
                    },
                    {
                        loader: 'stylus-loader',
                        options: {
                            preferPathResolver: 'webpack',
                            define: {
                                url: function (literal) {
                                    return new stylus.nodes.Literal(
                                        'url(\'/collectstatic/frontend/' + literal.string + '\')'
                                    );
                                }
                            },
                            paths: [
                                stylePath,
                                nodeModulesPath,
                                sourcePath,
                            ],
                            use: [
                                require('nib')()
                            ],
                            import: [
                                '~nib/index.styl',
                            ]
                        }
                    }
                ]
            }, {
                test: /\.mdx$/,
                use: ['babel-loader', '@mdx-js/loader'],
            }]
        },
        watchOptions: {
            poll: 5000,
            ignored: ['node_modules']
        },
        plugins: [
            // Create our vendor file
            new MergeIntoSingleFilePlugin({
                files: getVendorEntries()
            }),

            // Check for circular dependencies
            new CircularDependencyPlugin({
                exclude: /node_modules/,
                cwd: process.cwd(),
            })
        ],
    };

    // Add notifications
    if (argv.env.notifications) {
        config.plugins.push(new WebpackBuildNotifierPlugin({
            title: 'Ambition webpack Build',
            sound: 'Tink',
        }))
    }

    // Return the config
    // const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
    // return new SpeedMeasurePlugin().wrap(config);
    return config;
};
