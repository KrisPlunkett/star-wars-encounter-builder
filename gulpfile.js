const build = require('./recruiting_project/frontend/src/utils/build');
const path = require('path');
const gulp = require('gulp');
const stylus = require('gulp-stylus');
const tap = require('gulp-tap');
const shell = require('gulp-shell');
const nib = require('nib');
const yargs = require('yargs');


let argv = yargs.argv;

// Config for compiling stylus files
let stylusConfig = {
    compress: true,
    define: {
        url: function(literal) {
            return new stylus.stylus.nodes.Literal(
                'url(\'../../' + literal.string + '\')'
            );
        }
    },
    import: [
        'nib',
    ],
    paths: [
         path.resolve(__dirname, 'recruiting_project/frontend/style'),
         path.resolve(path.resolve(__dirname, 'node_modules')),
    ],
    use: [
        nib()
    ],
    'include css': true
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Tasks below here
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Task that will compile all style files
 */
gulp.task('compile:css', gulp.parallel(
    function() {
        return gulp.src(['recruiting_project/frontend/style/*.css'])
            .pipe(gulp.dest('recruiting_project/frontend/static/frontend/build'));
    },
    function() {
        return gulp.src(['recruiting_project/frontend/style/*/*.styl'])
            .pipe(stylus(stylusConfig))
            .pipe(gulp.dest('recruiting_project/frontend/static/frontend/build'));
    }
));


/**
 * Watches all style src files and builds the application of the containing file that changed.
 **/
gulp.task('watch:style', function() {
    let applicationPageMap = build.getPagesFromArguments(argv.page);
    const watcher = gulp.watch(['recruiting_project/frontend/style/**/*.styl']);

    watcher.on('all', function(event, path) {
        // Figure out what apps we want to build
        let buildApps = Object.keys(applicationPageMap);

        // Replace backslashes with normal slashes to handle inferior os path strings
        path = path.replace(/\\/g, '/');

        // Split the file's path to isolate the app-specific heirarchy
        let parts = path.split('recruiting_project/frontend/style');

        // Get the app name that the file came to target all top-level Stylus files in the following glob
        let appName = parts[1].split('/')[1];

         // If the app is not in the passed apps, add it to the list of apps we wish to build
        if (buildApps.indexOf(appName) === -1) {
            buildApps.push(appName)
        }

        // Build the source paths for the build process
        let srcPaths = [];
        for (let i = 0; i < buildApps.length; i++) {
            // Get the app pages
            let pages = applicationPageMap[buildApps[i]] || [];
            if (pages.length) {
                for (let j = 0; j < pages.length; j++) {
                    srcPaths.push('recruiting_project/frontend/style/' + buildApps[i] + '/' + pages[j] + '.styl');
                }
            } else {
                srcPaths.push('recruiting_project/frontend/style/' + buildApps[i] + '/*.styl');
            }
        }

        // Log what applications we are building
        console.log(new Date().toString(), 'Started compiling styling applications: ', buildApps, srcPaths);

        return gulp.src(
            srcPaths
        ).pipe(tap(function(file) {
            let filePath = file.path.replace(/\\/g, '/');
            file.named = filePath.split('/').slice(-2).join('/');
        })
        ).pipe(
            stylus(stylusConfig)
        ).pipe(gulp.dest(function(file) {
            // Pull the app from the file named
            let appName = file.named.split('/')[0];
            return 'recruiting_project/frontend/static/frontend/build/' + appName;
        })
        ).on('end', function() {
            console.log(new Date().toString(), 'Finished compiling styling for applications:', buildApps);
        });
    });
});

/**
 * Build all the css and js
 */
gulp.task('build', gulp.parallel(
    'compile:css',
    shell.task('npx webpack --mode=development')
));
gulp.task('build_production', gulp.parallel(
    'compile:css',
    shell.task('npx webpack --mode=production')
));


/**
 * Run all watch tasks that will watch and compile js and css
 */
let webpackArgs = [
    '--mode=development',
    '--watch',
];
if (argv.page) {
    webpackArgs = webpackArgs.concat(argv.page.map(page => '--env.page=' + page))
}
if (argv.notifications) {
    webpackArgs.push('--env.notifications');
}
gulp.task('watch', gulp.parallel(
    'compile:css',
    'watch:style',
    shell.task('npx webpack ' + webpackArgs.join(' '))
));
