/*
 * deeds/index.ts
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

/*
  An explanation for this file.

In the past versions of scipnet, each DEEDS request had its own file. Look back in the Git history to see this
in action. There were two problems with this system:

 1). It took up too much space. The bundle that resulted from this system was about 220KB in size. Half of this
     was JQuery, which I've already put a lot of effort into minimizing. 25% of this was DEEDS files. Although
     one of the goals for this project is to ensure type consistency, having half of the program code be dedicated
     just to that seems a little impractical to me.
 2). It was inefficient. Although Browserify is efficient enough, having to load seperate instances of the JQuery
     and Bluebird modules for each request type will most likely slow down older systems.

To counteract this, there were two possible options.

 1). Put every DEEDS request into one file. This would be the fastest option, but it would result in a large,
     hard-to-edit file that would somewhat ameliorate, but not entirely solve, the size issue.
 2). Summarize every DEEDS request type via a JSON file (in this directory as "requests.json") and create
     functions at runtime based off of them.

I have chosen to use Option 2, since in most modern browsers the creation of these functions will not incur a
noticeable loss in runtime performance. In the "bin" directory in the git root, there is a file called
"generate-deeds-typings.py" which will read requests.json and generate a type bindings file to ensure type
safety. 

*/

exports.__esModule = true;

const { createDeedsFunction } = require("./deeds-function");
const deedsFunctions = require("./requests.json");

let deedsFunction;
for (let i = 0; i < deedsFunctions.length; i++) {
  deedsFunction = deedsFunctions[i];
  exports[deedsFunction.name] = createDeedsFunction(deedsFunction);
}
