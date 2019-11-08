/*
 * rating.ts
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

// functions that have to do with ratings
import * as $ from "jquery";

import deeds from "./../deeds";

export async function ratePage(rating: number): Promise<void> {
  console.log(`Calling ratePage with rating ${rating}`);

  if (rating > 1 || rating < -1) {
    throw new Error("Invalid rating value")
  }

  const res = await deeds("voteOnPage", { rating });

  if (res.hasOwnProperty("notLoggedIn") && res.notLoggedIn) {
    throw new Error("You must be logged in to vote on pages.");
    return;
  }

  if (res.hasOwnProperty("result") && !res.result) {
    throw new Error(`Failed to vote on page: ${res.error}`);
    return;
  }

  let ratingText = `${res.rating}`;
  if (res.rating > 0) {
    ratingText = `+${ratingText}`;
  }

  $(".rating").html(`rating: ${ratingText}`);
}

// put ratePage into the global namespace for testing
declare var global: any;
if (global) {
  global.ratePage = ratePage;
}
