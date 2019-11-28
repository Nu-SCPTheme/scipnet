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

// some of these declaration files aren't fully written, hence the ts-ignore
import * as _ from "lodash";
import * as babelify from "babelify";
import * as browserify from "browserify";
import * as child_process from "child_process";
// @ts-ignore
import * as eslint from "gulp-eslint";
import * as fs from "fs";
import * as gulp from "gulp";
import * as sourcemaps from "gulp-sourcemaps";
// @ts-ignore
import * as terser from "gulp-terser";
import * as ts from "gulp-typescript";
import * as watch from "gulp-watch";

import { promisify } from "util";

// tell which target to compile to
const target = process.env.TS_TRANSPILE_TARGET || "es3";
const tsProject = ts.createProject("tsconfig.json", { target });

// other assorted env variables
const includeCoreJs = (process.env.INCLUDE_CORE_JS === undefined ? true : process.env.INCLUDE_CORE_JS === "true");
const minify = (process.env.MINIFY === undefined ? false : process.env.MINIFY === "true");

// helper function to create a directory if it does not exist yet
function createDir(name: string) {
  if (!fs.existsSync(name)) {
    fs.mkdirSync(name);
  }
}

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// create a task that replaces one instance of data with another
function createReplaceTask(name: string, replaced: string, replacement: string, filename: string) {
  gulp.task(name, async () => {
    let data = (await readFile(filename)).toString();
    data = data.replace(replaced, replacement);
    await writeFile(filename, data);
  });
}

createReplaceTask("remove-corejs", `require("core-js/stable");`, "", "dist/sources/_entry.js");

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

let tasks: Array<any> = ["typescript", "browserify"];
let preBrowserifyTasks = [];
if (!includeCoreJs) {
  preBrowserifyTasks.push("remove-corejs");
}
if (minify) {
  tasks.push("uglify");
}

// add preBrowserifyTasks to tasks
tasks.splice(1, 0, preBrowserifyTasks);

// flatten the array
tasks = _.flatten(tasks);

gulp.task("default", gulp.parallel(["lint", gulp.series(tasks)]));
