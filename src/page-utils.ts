/*
 * page-utils.ts
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

// set up triggers relating to page utilities
import "core-js/features/promise";

import { nonIntrusiveDialog } from "./dialog";
import { ratePage } from "./rating";

// wrap promises related to page utils
function promiseWrapper(func: () => Promise<void>): () => void {
  return function() {
    func().then(() => {}).catch((err: Error) => {
      nonIntrusiveDialog("Error", err.message);
    });
  }
}

export default function setupPageUtils() {
  const upvoters = document.getElementsByClassName("upvoteButton");
  for (let i = 0; i < upvoters.length; i++) { // a for of loop won't work here
    let upvoter = upvoters[i];
    upvoter.addEventListener("click", promiseWrapper(async () => {
      ratePage(1);
    }));
  }
}
