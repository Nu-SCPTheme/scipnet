/*
 * object.ts
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

// this is a very simple polyfill for the Object class,
// which Browserify needs to function
// This should help es3 environments run es5 code
(function(global) {
  if (!global.Object) {
    global.Object = function(base) {
      if (!(this instanceof global.Object)) return new global.Object(base);
    }
  }

  // helper functions
})((function() {
  // determine what the global namespace should be
  if (typeof global !== "undefined") {
    return global;
  } else if (typeof window !== "undefined") {
    return window;
  } else if (typeof this !== "undefined") {
    return this;
  } else return {}; // fail silently
})());
