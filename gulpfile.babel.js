/**
 * GULPFILE
 * AVAILABLE TASKS:
 * [default]    Builds project.
 * [build]      Performs a full clean, then compiles src/ => dist/.
 * [watch]      Compiles changes to src/ => dist/ then watches for changes. Changes to
 *                js files will restart the node application. Changes to scss files
 *                will compile and then live-inject the css.
 */

var browserSync = require('browser-sync');
var del = require('del');
var gulp = require('gulp');
var path = require('path');
var pump = require('pump');
var combine = require('stream-combiner');

var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var cache = require('gulp-cached');
var concat = require('gulp-concat');
var eslint = require('gulp-eslint');
var nodemon = require('gulp-nodemon');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

var port = '3000';

var entry = 'node_modules/rachael-io-common/bin/www';
var src = 'src';
var dist = 'dist';
var staticFiles = [
  'public/**/*.*',
  'static/**/*.*',
  'views/**/*.pug'
];

var dest = () => gulp.dest(dist);

function reportErr(taskName) {
  return function(err) {
    if(err) console.log('[%s] Err: %s', taskName, err);
  }
}

gulp.task('default', ['build'], function() {
});

//****************************************************************************//
// WATCH                                                                      //
//****************************************************************************//

gulp.task('watch', ['build', 'browser-sync'], function() {
  gulp.watch(path.join(src, 'scss/**/*.scss'), ['build:scss:new']);
});

gulp.task('browser-sync', ['nodemon'], function() {
  browserSync.init(null, {
    proxy: "http://localhost:" + port,
    files: staticFiles,
    browser: "google chrome",
    port: 8080,
  });
});

gulp.task('nodemon', function(cb) {
  var started = false;
  nodemon({
    script: entry,
    ignore: [dist, 'gulpfile.js'],
    tasks: ['build:js:new']
  }).on('start', function() {
    // to avoid nodemon being started multiple times - thanks @matthisk
    if (!started) {
      cb();
      started = true;
    }
  });
});

//****************************************************************************//
// BUILD                                                                      //
//****************************************************************************//

gulp.task('build', ['build:js', 'build:scss'], function(cb) {
  cb();
});

//****************************************************************************//
// JAVASCRIPT                                                                 //
//****************************************************************************//

var jsSrc = () => gulp.src(path.join(src, '**/*.js'));
var jsCache = () => cache('js');

var jsCompilePipeline = () => combine(
  sourcemaps.init(),
  babel({ presets: ['es2015'] }),
  uglify(),
  sourcemaps.write()
);

gulp.task('clean:js', function() {
  return del(path.join(dist, '**/*.js'));
});

gulp.task('lint:es', function() {
  return pump(jsSrc(),
              eslint(),
              eslint.format(),
              reportErr('lint:es')
         );
});

gulp.task('build:js', ['clean:js', 'lint:es'], function() {
  pump(jsSrc(),
       jsCompilePipeline(),
       dest(),
       reportErr('build:js')
  );
});

gulp.task('build:js:new', ['lint:es'], function() {
  pump(jsSrc(),
       jsCache(),
       jsCompilePipeline(),
       dest(),
       reportErr('build:js:new')
  );
});

//****************************************************************************//
// CSS/SCSS                                                                   //
//****************************************************************************//

var scssSrc = () => gulp.src(path.join(src, 'scss/**/*.scss'));
var scssCache = () => cache('scss');
var cssDest = () => gulp.dest(path.join(dist, 'css'));

var scssCompilePipeline = () => combine(
  sourcemaps.init(),
  sass({outputStyle: 'compressed'}).on('error', sass.logError),
  autoprefixer({ browsers: ['last 2 versions'] }),
  rename({ extname: '.min.css' }),
  sourcemaps.write()
);

gulp.task('clean:css', function() {
  return del(path.join(dist, 'css/*'));
});

gulp.task('build:scss', ['clean:css'], function() {
  pump(scssSrc(),
       scssCompilePipeline(),
       cssDest(),
       reportErr('build:scss')
  );
});

gulp.task('build:scss:new', function() {
  pump(scssSrc(),
       scssCache(),
       scssCompilePipeline(),
       cssDest(),
       browserSync.stream(),
       reportErr('build:scss:new')
  );
});
