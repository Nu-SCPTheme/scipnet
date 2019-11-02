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
import * as $ from "jquery";

import { nonIntrusiveDialog } from "./../dialog";
import { ratePage } from "./rating";

// wrap promises related to page utils
function promiseWrapper(func: () => Promise<void>): () => void {
  return function() {
    func().then(() => {}).catch((err: Error) => {
      nonIntrusiveDialog("Error", err.message);
    });
  }
}

// setup rating trigger
function setupRatingTrigger(className: string, rating: number) {
  $(`.page-rate-widget-box.${className}`).click(promiseWrapper(async () => {
    await ratePage(rating);
  }));
}

// setup triggers for page utilities
export default function setupPageUtils() {
  setupRatingTrigger("rateup", 1);
  setupRatingTrigger("ratedown", -1);
  setupRatingTrigger("cancel", 0);
}
