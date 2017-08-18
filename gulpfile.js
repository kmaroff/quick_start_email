var gulp = require('gulp'),
    sass = require('gulp-sass'),
    inky = require('inky'),
    inlineCss = require('gulp-inline-css'),
    browserSync = require('browser-sync'),
    inlinesource = require('gulp-inline-source'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache');


// Обновление страниц сайта на локальном сервере
gulp.task('browser-sync', function () {
    browserSync({
        proxy: "email.loc",
        notify: false
    });
});

//STYLES
gulp.task('styles', function () {
    return gulp.src('./scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.reload({ stream: true }));
});

//CONVERTE INKY
gulp.task('inky', ['styles'], function () {
    return gulp.src('./templates/**/*.html')
        .pipe(inlinesource())
        .pipe(inky())
        .pipe(inlineCss({
            preserveMediaQueries: true,
            removeLinkTags: false
        }))
        .pipe(gulp.dest('./dist'));
});

// Наблюдение за файлами
gulp.task('watch', ['styles', 'browser-sync'], function () {
    gulp.watch(['./scss/*.scss', './templates/**/*.html'], ['inky']);
    gulp.watch('./templates/**/*.html', browserSync.reload);
    gulp.watch(['inky'], browserSync.reload);
});
// Сжатие картинок
gulp.task('imagemin', function () {
    return gulp.src('img/**/*')
        .pipe(cache(imagemin()))
        .pipe(gulp.dest('dist/'));
});

// Сборка тасков
gulp.task('build', ['inky', 'styles', 'imagemin']);

// Выгрузка изменений на хостинг
gulp.task('deploy', function () {
    var conn = ftp.create({
        host: 'host',
        user: 'user',
        password: 'password',
        parallel: 10,
        log: gutil.log
    });
    var globs = [
        'wp-content/themes/your_theme/**'
    ];
    return gulp.src(globs, { buffer: false })
        .pipe(conn.dest('your_website.ru/public_html/wp-content/themes/your_theme'));
});

gulp.task('clearcache', function () { return cache.clearAll(); });
gulp.task('default', ['watch']);