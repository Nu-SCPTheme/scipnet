/*!
 * _entry.ts
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

// note: this is called _entry.ts so it comes first in the browserify bundle
// this way, it's better to setup global polyfills here than anywhere else

// imports from core-js, should polyfill out most standards
import "core-js/stable";

// promise polyfill, if needed, will be put here

import * as $ from "jquery";
import * as BluebirdPromise from "bluebird";

import setupAuth from "./login";
import setupMarkdown from "./markdown";
import setupPageUtils from "./page-utils";

// document onload
$(() => {
  console.log("Initialize SCIPNET onload scripts...");
  setupMarkdown();
  setupAuth();
  setupPageUtils();
});
