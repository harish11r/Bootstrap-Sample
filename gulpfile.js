const { src, dest, series, watch, parallel } = require('gulp')
const del = require('del')
const beautify = require('gulp-beautify')
const webServer = require('gulp-webserver')
const sass = require('gulp-sass')(require('sass'))

function cleanDist() {
  return del(['docs'])
}

function copyStaticToDist() {
  return src(['src/static/**/*.*']).pipe(dest('docs' + '/static/'))
}

function copyHtmlToDist() {
  return src(['src/*.html'])
    .pipe(beautify.html({ indent_size: 4, preserve_newlines: false }))
    .pipe(dest('docs'))
}

function copyJsToDist() {
  return src(['src/js/**/*.js']).pipe(dest('docs' + '/js/'))
}

function copyScssToDist() {
  return src(['src/scss/**/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(dest('docs' + '/css/'))
}

function watchFiles() {
  watch('src/js/**/*', copyJsToDist)
  watch('src/scss/**/*', copyScssToDist)
  watch('src/*', copyHtmlToDist)
}

function webServerStart() {
  return src('docs').pipe(
    webServer({
      port: 8000,
      livereload: true,
      directoryListing: false,
      open: true,
      fallback: './docs/index.html',
    }),
  )
}

exports.build = series(cleanDist, copyHtmlToDist, copyStaticToDist)
exports.default = series(
  copyStaticToDist,
  copyHtmlToDist,
  copyJsToDist,
  copyScssToDist,
  parallel(watchFiles, webServerStart),
)
