import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import htmlmin from 'gulp-htmlmin';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import terser from 'gulp-terser';
import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';
import svgstore from 'gulp-svgstore';
import del from 'del';

// Styles

export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// HTML

const html = () => {
  return gulp.src('source/*.html')
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest('build'));
}

// scripts

export const scripts = () => {
  return gulp.src('source/js/script.js')
  .pipe(terser())
  .pipe(rename('script.min.js'))
  .pipe(gulp.dest('build/js'));
}

// images

export const optimizeImages = () => {
  return gulp.src('source/img/**/*.{jpg,png,svg}')
  .pipe(imagemin())
  .pipe(gulp.dest('build/img'));
}

export const copyImages = () => {
  return gulp.src('source/img/**/*.{jpg,png,svg}')
  .pipe(gulp.dest('build/img'));
}

// webp

export const createWebp = () => {
  return gulp.src(['source/img/**/*.{jpg,png}',
                '!source/img/favicon/*.png']
                )
  .pipe(webp({quality: 90}))
  .pipe(gulp.dest('build/img'));
}

// sprite

export const sprite = () => {
  return gulp.src('source/img/**/*.svg')
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('build/img'));
}

// copy

export const copy = (done) => {
  gulp.src([
    "source/fonts/*.{woff2,woff}",
    "source/*.ico",
    "source/manifest.json"
  ], {
    base: "source"
  })
  .pipe(gulp.dest('build'))
  done();
}

// clean

export const clean = () => {
  return del('build');
}

// Server

export const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// reload

const reload = (done) => {
  browser.reload()
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/js/script.js', gulp.series(scripts));
  gulp.watch('source/*.html', gulp.series(html, reload));
}

// build

export const build = gulp.series (
  clean,
  copy,
  optimizeImages,
  gulp.parallel (
    styles,
    html,
    scripts,
    sprite,
    createWebp
  ),
);


// default

export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    sprite,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  ));
