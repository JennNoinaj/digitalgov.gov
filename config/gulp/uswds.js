/*
* * * * * ==============================
* * * * * ==============================
* * * * * ==============================
* * * * * ==============================
========================================
========================================
========================================
----------------------------------------
USWDS SASS GULPFILE
----------------------------------------
*/

var autoprefixer  = require('autoprefixer');
// var autoprefixerOptions = require('./node_modules/uswds-gulp/config/browsers');
var cssnano       = require('cssnano');
var gulp          = require('gulp');
var mqpacker      = require('css-mqpacker');
var notify        = require('gulp-notify');
var path          = require('path');
var pkg           = require('../../package.json');
var postcss       = require('gulp-postcss');
var rename        = require('gulp-rename');
var replace       = require('gulp-replace');
var sass          = require('gulp-sass');
var sourcemaps    = require('gulp-sourcemaps');
var uswds         = require('../uswds');

/*
----------------------------------------
PATHS
----------------------------------------
- All paths are relative to the
  project root
- Don't use a trailing `/` for path
  names
----------------------------------------
*/

// Project Sass source directory
const PROJECT_SASS_SRC = './themes/digital.gov/src/uswds';

// Images destination
const IMG_DEST = './themes/digital.gov/static/lib/uswds';

// Fonts destination
const FONTS_DEST = './themes/digital.gov/static/fonts';

// Javascript destination
const JS_DEST = './themes/digital.gov/static/dist';

// Compiled CSS destination
const CSS_DEST = './themes/digital.gov/static/dist';

/*
----------------------------------------
TASKS
----------------------------------------
*/

gulp.task('copy-uswds-setup', () => {
  return gulp.src(`${uswds}/scss/theme/**/**`)
  .pipe(gulp.dest(`${PROJECT_SASS_SRC}`));
});

gulp.task('copy-uswds-fonts', () => {
  return gulp.src(`${uswds}/fonts/**/**`)
  .pipe(gulp.dest(`${FONTS_DEST}`));
});

gulp.task('copy-uswds-images', () => {
  return gulp.src(`${uswds}/img/**/**`)
  .pipe(gulp.dest(`${IMG_DEST}`));
});

gulp.task('copy-uswds-js', () => {
  return gulp.src(`${uswds}/js/**/**`)
  .pipe(gulp.dest(`${JS_DEST}`));
});

gulp.task('build-sass', function(done) {
  var plugins = [
    // Autoprefix
    autoprefixer(require('./browsers')),
    // Pack media queries
    mqpacker({ sort: true }),
    // Minify
    cssnano(({ autoprefixer: { browsers: require('./browsers') }}))
  ];
  return gulp.src([
      `${PROJECT_SASS_SRC}/*.scss`
    ])
    .pipe(replace(
      /\buswds @version\b/g,
      'uswds v' + pkg.version
    ))
    .pipe(sourcemaps.init({ largeFile: true }))
    .pipe(sass({
        includePaths: [
          `${PROJECT_SASS_SRC}`,
          `${uswds}/scss`,
          `${uswds}/scss/packages`,
        ]
      }))
    .pipe(postcss(plugins))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(`${CSS_DEST}`))
    .pipe(notify({
      "sound": "Pop" // case sensitive
    }));
});

gulp.task('init', gulp.series(
  'copy-uswds-setup',
  'copy-uswds-fonts',
  'copy-uswds-images',
  'copy-uswds-js',
  'build-sass',
));

gulp.task('watch-sass', function () {
  gulp.watch(`${PROJECT_SASS_SRC}/**/*.scss`, gulp.series('build-sass'));
});

gulp.task('watch', gulp.series('build-sass', 'watch-sass'));

gulp.task('default', gulp.series('watch'));