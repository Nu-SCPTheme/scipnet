# Scipnet - Frontend scripts for Mekhane

<a href="https://travis-ci.org/Nu-SCPTheme/scipnet/"><img src="https://travis-ci.org/Nu-SCPTheme/scipnet.svg?branch=master" alt="Travis Build" /></a>

scipnet is the name given to the scripts that run on the client side of a shared wiki site. The main responsibilities of scipnet are to manage esoteric markdown elements (such as collapsibles) and to handle events (such as upvoting a page).

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
$ npm run webpack
```

`webpack` will generate a file named `dist/bundle.js`. This is the file that will be included into the web page, and contains all frontend code.

If you would like to run the test suite, omit the `--production` flag from `npm i` and then run `make test`.

#### Note

Although `scipnet` is meant to be built on a Linux-like operating system, it is designed to be browser-independent and should work with most operating systems with a web browser installed.

## Compatibility

Portability was taken into account during design. At a minimum, Scipnet should work functionally on any browser that supports ECMAScript 5. This includes:

* IE >= 9
* Safari >= 6
* Pretty much any modern browser (for more information, see [here](https://caniuse.com/#feat=es5))

*In theory*, this should work on IE8 as well (and *maybe* IE7). However, I wouldn't be surprised if a few features didn't work, or if it just outright breaks.

## License

**GNU AGPL**

scipnet
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
