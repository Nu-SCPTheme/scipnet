/*
 * hide-all.ts
 *
 * scipnet - Frontend scripts for mekhane
 * Copyright (C) 2019-2020 not_a_seagull
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

// exports a function that closes out all other utility blocks
import * as $ from "jquery";

const utilityBlockIds = [
  "utility-rating-module",
  "utility-edit-block",
  "utility-tags-block",
  "utility-history-block",
  "utility-pagesrc-block",
  "utility-parent-block",
  "utility-rename-block"
];

// construct a selector to select all of the utilities
const utilityBlockSelector = $.map(utilityBlockIds, (utilityBlockId: string): string => {
  return `#${utilityBlockId}`;
}).join(", ");
const utilityBlocks = $(utilityBlockSelector);

export default function closeUtilities() { 
  utilityBlocks.addClass("vanished");
}
