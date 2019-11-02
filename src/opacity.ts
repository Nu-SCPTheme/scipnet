/*
 * opacity.ts
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

// allows opacity scaling, i.e. make things gradually appear
import "core-js/features/promise";
import "regenerator-runtime";

import * as $ from "jquery";

import { timeout } from "./utils";

export default async function opacityScale(
  element: JQuery,
  mstime: number, 
  start: number = 0, 
  end: number = 100
): Promise<void> {
  // go every 5 ms
  const interval = 5;
  const increment = (end - start) / (mstime / interval);

  let totalOpacity = start;
  while (totalOpacity < end) {
    element.css("opacity", totalOpacity / 100); 
    await timeout(interval);
    totalOpacity += increment;
  }

  element.attr("style", "");
}
