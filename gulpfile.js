const gulp = require('gulp'); //вызываем gulp(команда require вызывает из папки node_modules все необходимые плагины)
const pug = require('gulp-pug');

const sass = require('gulp-sass');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');

const del = require('del');

const browserSync = require('browser-sync').create(); //создали объект

const gulpWebpack = require('gulp-webpack'); // "подружить" gulp & wp
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');

const autoprefixer = require('gulp-autoprefixer');

const notify = require("gulp-notify");

//пути
const paths = {
    root: './build', //название корня билда
    templates: {
        pages: 'src/templates/pages/*.pug', //где хранятся page's
        src: 'src/templates/**/*.pug', //все паг файлы, за которыми нужно следить
        dest: 'buil/assets/' //куда в итоге положить файлы
    },
    styles: {
        src: 'src/styles/**/*.scss',
        dest: 'build/assets/styles/'
    },
    images: {
        src: 'src/images/**/*.*',
        dest: 'build/assets/images/'
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'build/assets/scripts/'
    }
}


// pug
function templates() {
    return gulp.src(paths.templates.pages) // берем все исходники - страницы
        .pipe(pug({ pretty: true })) // pretty true - сделает табуляцию по краям страницы
        .pipe(gulp.dest(paths.root)); //куда нужно положить
}

// scss
function styles() {
    return gulp.src('./src/styles/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(autoprefixer({browsers: ['last 2 versions'],cascade: false}))
        .pipe(sourcemaps.write())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(notify('Work!'))
}

// очистка
function clean() {
    return del(paths.root);
}


// webpack
function scripts() {
    return gulp.src('src/scripts/app.js')
        .pipe(gulpWebpack(webpackConfig, webpack)) //чтобы запусть wb 4й верисии
        .pipe(gulp.dest(paths.scripts.dest));
}



// слежка
function watch() {
    gulp.watch(paths.styles.src, styles); // если менятся стили, запускаются "styles"
    gulp.watch(paths.templates.src, templates);  // если менются шаблоны - "templates"
    gulp.watch(paths.images.src, images); 
    gulp.watch(paths.scripts.src, scripts); 
}



// следим за build и релоадим браузер 
function server() {
    browserSync.init({
        server: paths.root
    });
    browserSync.watch(paths.root + '/**/*.*', browserSync.reload);
}


// просто переносим картинки
function images() {
    return gulp.src(paths.images.src)
        .pipe(gulp.dest(paths.images.dest));
}

//Экспорты
exports.templates = templates; // рекомендуемый синтаксис из док-ции gulp 4
exports.styles = styles;
exports.clean = clean;
exports.images = images;

gulp.task('default', gulp.series(
    clean,
    gulp.parallel(styles, templates, images,scripts),
    gulp.parallel(watch, server)
));