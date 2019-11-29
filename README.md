# Scipnet - Frontend scripts for Mekhane

<a href="https://travis-ci.org/Nu-SCPTheme/scipnet/"><img src="https://travis-ci.org/Nu-SCPTheme/scipnet.svg?branch=master" alt="Travis Build" /></a>

Scipnet is the name given to the scripts that run on the client side of Project Mekhane (a project to create a sustainable open-source wiki site). The main responsibilities of Scipnet are to manage esoteric markdown elements (such as collapsibles) and to handle events (such as upvoting a page).

## Installation

First, you should have the `node` runtime installed, as well as `python3` to run some build scripts. If you don't have them already, you can download them via APT:

```bash
# apt install node python3
```

Then, clone and build Scipnet:

```bash
$ git clone https://github.com/Nu-SCPTheme/scipnet.git
$ cd scipnet
$ npm install --production
$ npm run gulp
```

`gulp` will generate a file named `dist/bundle.js`. This is the file that will be included into the web page, and contains all frontend code.

If you would like to run the test suite, omit the `--production` flag from `npm i` and then run `make test`.

#### Note

Although `scipnet` is meant to be built on a Linux-like operating system, it is designed to be browser-independent and should work with most operating systems with a web browser installed.

## Compatibility

Portability was taken into account during design. At a minimum, Scipnet should work functionally on any browser that supports ECMAScript 5. This includes:

* IE >= 9
* Safari >= 6
* Pretty much any modern browser (for more information, see [here](https://caniuse.com/#feat=es5))

*In theory*, this should work on IE8 as well (and *maybe* IE7). However, I wouldn't be surprised if a few features didn't work, or if it just outright breaks.

## Minification

As of the time of writing, the resulting `dist/bundle.js` file is around 930 kilobytes. This is primarily due to the inclusion of frameworks such as [jQuery](https://github.com/jquery/jquery), [bluebird](https://github.com/petkaantonov/bluebird) and [core-js](https://github.com/zloirock/core-js) to increase compatibility with older browsers. Understandably, it would be better if the bundle file was smaller. If needed, you can run

```bash
$ npm run uglify
```

or, while running the main gulp build:

```bash
$ MINIFY=true npm run gulp
```

in order to use [terser](https://github.com/terser/terser) to minify the bundle file to around 300 kilobytes. If needed, a sourcemap file will be generated at `dist/bundle.js.map`.

If a smaller bundle is desired, setting `INCLUDE_CORE_JS` to `false` and `PROMISE_TYPE` to `default` is known to reduce the bundle’s size by around 500K (with a minified bundle weighing about 120K). This bundle should still work on *most* browsers (only IE8 and older should have any real problems).

## Other Build Modifications

The following environment variables can be set to modify the build process.

* `CUSTOM_JQUERY` - Builds a custom version of the `jquery` library. This defaults to `true`, and will build a version of the library that excludes several unused features. In the event that it becomes necessary to use the stock version of `jquery`, this can be set to false.
* `INCLUDE_CORE_JS` - Include the `core-js` library. The default for this is option is `true`. If set to `false`, the browserify bundle will not include `core-js`. This will reduce the size of the bundle by a significant amount; however, compatibility with older browsers will be lost.
* `MINIFY` - Run the `terser` minification library to reduce the bundle's file size if set to `true`. See the Minification section above for more information. 
* `PROMISE_TYPE` - Set the promise library used in the frontend. The following options are accepted:
  * `bluebird` - Uses [petkaantonov/bluebird](https://github.com/petkaantonov/bluebird). This is the default.
  * `default` - Uses the default promise in the environment. This may cause failures on browsers where `Promise` is not automatically defined. However this will most likely be faster and less spacious than `bluebird`.
  * `corejs` - Uses the promise polyfill from the [core-js](https://github.com/zloirock/core-js) library.
  * `es6` - Uses [stefanpenner/es6-promise](https://github.com/stefanpenner/es6-promise). Before using this, you must first run `npm i es6-promise`.
  * `then` - Uses [then/promise](https://github.com/then/promise). Before using this, you must first run `npm i promise`.

## License

**GNU AGPL**

scipnet - Frontend scripts for mekhane
Copyright (C) 2019 not_a_seagull

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.
