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
import * as babelify from "babelify";
import * as browserify from "browserify";
import * as child_process from "child_process";
// @ts-ignore
import * as eslint from "gulp-eslint";
import * as fs from "fs";
import * as gulp from "gulp";
import * as path from "path";
import * as sourcemaps from "gulp-sourcemaps";
// @ts-ignore
import * as terser from "gulp-terser";
import * as ts from "gulp-typescript";
//import * as watch from "gulp-watch";

import { promisify } from "util";

import "core-js/features/array/flat";

// tell which target to compile to
const target = process.env.TS_TRANSPILE_TARGET || "es3";
const tsProject = ts.createProject("tsconfig.json", { target });

// other assorted env variables
const debug = (process.env.DEBUG === undefined ? false : process.env.DEBUG === "true");
const customJquery = (process.env.CUSTOM_JQUERY === undefined ? !debug : process.env.CUSTOM_JQUERY === "true");
const includeCoreJs = (process.env.INCLUDE_CORE_JS === undefined ? true : process.env.INCLUDE_CORE_JS === "true");
const minify = (process.env.MINIFY === undefined ? false : process.env.MINIFY === "true");
const promiseType = process.env.PROMISE_TYPE || "bluebird";

// helper function to create a directory if it does not exist yet
function createDir(name: string) {
  if (!fs.existsSync(name)) {
    fs.mkdirSync(name);
  }
}

const lstat = promisify(fs.lstat);
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// create a task that replaces one instance of data with another
function createReplaceTask(name: string, replaced: string, replacement: string, filename: string) {
  gulp.task(name, async () => {
    let data = (await readFile(filename)).toString();
    data = data.split(replaced).join(replacement);
    await writeFile(filename, data);
  });
}

createReplaceTask("remove-corejs", `require("core-js/stable");`, "", "dist/sources/_entry.js");

// create tasks to replace one promise type with another
function createReplaceOnAllTask(name: string, replaced: string, replacement: string) {
  gulp.task(name, async () => {
    let promises: Array<Promise<void>> = [];

    await (async function replace(dirname: string) {
      for (const file of await readdir(dirname)) {
        promises.push((async () => {
          const filename = path.join(dirname, file);
          if ((await lstat(filename)).isDirectory()) {
            promises.push(replace(filename));
          }

          try {
            let data = (await readFile(filename)).toString();
            data = data.split(replaced).join(replacement);
            await writeFile(filename, data); 
          } catch (err) {
            // this is ususally an attempt to read a directory
            // console.error(`Failed to replace on ${filename}: ${err}`);
          }
        })());
      }
    })("dist/sources");
    await Promise.all(promises);
  });
}

// setup default promise usage
createReplaceOnAllTask("reset-promise-name", "BluebirdPromise", "Promise");
createReplaceOnAllTask("delete-bluebird-import", `var Promise = require("bluebird");`, "");
gulp.task("default-promise", gulp.series("reset-promise-name", "delete-bluebird-import"));

// setup core-js promise usage
createReplaceTask("add-corejs-promise", `// promise polyfill, if needed, will be put here`, `require("core-js/features/promise");`, "dist/sources/_entry.js");
gulp.task("corejs-promise", gulp.series("reset-promise-name", "delete-bluebird-import", "add-corejs-promise"));

function createPromiseReplacementTask(name: string, promiseName: string, libName: string, modRequire: boolean) {
  const pnName = `${name}-promise-name`;
  const lnName = `${name}-lib-name`; 
  const mrName = `${name}-modify-require`;

  createReplaceOnAllTask(pnName, "BluebirdPromise", promiseName);
  createReplaceOnAllTask(lnName, "bluebird", libName);

  let tasks = [pnName, lnName];

  if (modRequire) {
    createReplaceOnAllTask(mrName, `require("${libName}");`, `require("${libName}").Promise;`);
    tasks.push(mrName);
  }
  
  gulp.task(name, gulp.series(tasks));
}

createPromiseReplacementTask("then-promise", "ThenPromise", "promise", false);
createPromiseReplacementTask("es6-promise", "Es6Promise", "es6-promise", true);

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

// build a replacement version of jquery
gulp.task("custom-jquery", () => (
  child_process.spawn("python3", ["bin/build-custom-jquery.py"], { stdio: "inherit" })
));

let tasks: Array<any> = ["typescript", "browserify"];
let preBrowserifyTasks = [];
if (!includeCoreJs) {
  preBrowserifyTasks.push("remove-corejs");
}
if (minify) {
  tasks.push("uglify");
}
if (promiseType !== "bluebird") {
  if (promiseType === "then") {
    preBrowserifyTasks.push("then-promise");
  } else if (promiseType === "corejs") {
    preBrowserifyTasks.push("corejs-promise");
  } else if (promiseType === "es6") {
    preBrowserifyTasks.push("es6-promise");
  } else if (promiseType === "default") {
    preBrowserifyTasks.push("default-promise");
  }
}
if (customJquery) {
  preBrowserifyTasks.push("custom-jquery");
}

// add preBrowserifyTasks to tasks
tasks.splice(1, 0, preBrowserifyTasks);

// flatten the array, this isn't standard in TS
// @ts-ignore
tasks = tasks.flat(3);

gulp.task("default", gulp.parallel(["lint", gulp.series(tasks)]));
