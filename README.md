# Scipnet - Frontend scripts for Mekhane

<a href="https://travis-ci.org/Nu-SCPTheme/scipnet/"><img src="https://travis-ci.org/Nu-SCPTheme/scipnet.svg?branch=master" alt="Travis Build" /></a>

Scipnet is the name given to the scripts that run on the client side of Project Mekhane (a project to create a sustainable open-source wiki site). The main responsibilities of Scipnet are to manage esoteric markdown elements (such as collapsibles) and to handle events (such as upvoting a page).

## Installation

```bash
git clone https://github.com/Nu-SCPTheme/scipnet.git
cd scipnet
npm i
make # alternatively, run "make test" to run the test suite after build
```

`make` will generate a file named `dist/bundle.js`. This is the file that will be included into the web page, and contains all frontend code.

## License

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
