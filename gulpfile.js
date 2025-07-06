const gulp = require("gulp");
const ts = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const { deleteAsync } = require("del");

// TypeScript project config
const tsProject = ts.createProject("tsconfig.json");

// Limpia la carpeta dist
function limpiar() {
  return deleteAsync(["dist"]);
}

// Compila los TS
function compilarTS() {
  return tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist/js"));
}

// Procesa CSS
function procesarCSS() {
  return gulp.src("src/css/**/*.css")
    .pipe(sourcemaps.init())
    .pipe(postcss([autoprefixer()]))
    .pipe(concat("styles.css"))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist/css"));
}

// Watcher
function watchArchivos() {
  gulp.watch("src/ts/**/*.ts", compilarTS);
  gulp.watch("src/css/**/*.css", procesarCSS);
}

exports.default = gulp.series(
  limpiar,
  gulp.parallel(compilarTS, procesarCSS),
  watchArchivos
);