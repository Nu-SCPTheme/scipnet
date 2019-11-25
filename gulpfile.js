/*
 * gulpfile.ts
 *
 * scipnet - Frontend scripts for mekhane
 * Copyright (C) 2019 not_a_seagull
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

const babelify = require("babelify");
const browserify = require("browserify");
const eslint = require("gulp-eslint");
const fs = require("fs");
const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const terser = require("gulp-terser");
const ts = require("gulp-typescript");

const target = process.env.TS_TRANSPILE_TARGET || "es3";
const tsProject = ts.createProject("tsconfig.json", { target });

// helper function to create a directory if it does not exist yet
function createDir(name) {
  if (!fs.existsSync(name)) fs.mkdirSync(name);
}

// lint typescript code
gulp.task("lint", () => {
  return gulp.src("src/**/*.ts")
    .pipe(eslint())
    .pipe(eslint.formatEach("compact", process.stderr))
    .pipe(eslint.failAfterError());
});

// compile typescript to javascript
gulp.task("typescript", () => {
  createDir("dist");
  createDir("dist/sources");
  return gulp.src("src/**/*.ts")
    .pipe(tsProject())
    .pipe(gulp.dest("dist/sources"));
});

// bundle all javscript files into one package
gulp.task("browserify", () => {
  createDir("dist");
  return browserify("dist/sources/_entry.js")
    .transform("babelify", { presets: ["@babel/preset-env"] })
    .bundle()
    .pipe(fs.createWriteStream("dist/bundle.js"));
});

// minify the resulting bundle
gulp.task("uglify", () => {
  createDir("dist");
  return gulp.src("dist/bundle.js")
    .pipe(sourcemaps.init())
    .pipe(terser({
      "compress": {
        "properties": false
      }
    }))
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("dist"));
});

gulp.task("default", gulp.parallel(["lint", gulp.series(["typescript", "browserify"])]));
