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
import "core-js/features/promise";

import deeds from "./deeds";

export async function ratePage(rating: number): Promise<void> {
  if (rating > 1 || rating < -1) {
    throw new Error("Invalid rating value")
  }

  const res = await deeds("voteOnPage", { rating: rating });

  if ("notLoggedIn" in res && res.notLoggedIn) {
    throw new Error("You must be logged in to vote on pages.");
    return;
  }

  if ("result" in res && !res.result) {
    throw new Error(`Failed to vote on page: ${res.error}`);
    return;
  }

  // set rating on all rating modules
  const ratings = document.getElementByClassName("rating");
  for (let i = 0; i < ratings.length; i++) {
    ratings[i].innerHTML = `${res.rating}`;
  }
}
