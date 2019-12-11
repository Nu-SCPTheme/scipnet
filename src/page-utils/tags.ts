/*
 * tags.ts
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

// functions for tagging the page
import * as $ from "jquery";
import * as BluebirdPromise from "bluebird";

import closeUtilities from "./hide-all";
import { getTags, setTags } from "./../deeds";

// store the tag blocks here for speed purposes
const tagBlock = $("#utility-tags-block");
const tagEntry = $("#tags-box");

export async function openTagBlock(): BluebirdPromise<void> {
  closeUtilities();

  const tags = (await getTags()).result.tags;
  const tagString = (<string[]>tags).join(" ");
  tagEntry.val(tagString);
  tagBlock.removeClass("vanished");
}

export async function submitTags(): BluebirdPromise<void> {
  const tags = (<string>tagEntry.val()).split(" ");
  await setTags(tags);
 
  // TODO: decide whether or not to reload page
  window.location.reload();
}

export function clearTags() {
  tagEntry.val("");
}
