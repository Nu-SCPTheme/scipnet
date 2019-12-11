/*
 * page-utils/parent.ts
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

// set a page's parent
import * as $ from "jquery";
import * as BluebirdPromise from "bluebird";

import closeUtilities from "./hide-all";
import { getParent, setParent } from "./../deeds";

const inputBox = $("#parent-box");
const parentBlock = $("#utility-parent-block");

export async function openParentBlock(): BluebirdPromise<void> {
  closeUtilities();

  const { result } = await getParent();
  const { parents } = result;
  const parentText = (<Array<string>>parents).join(" ");

  inputBox.val(parentText);  
  parentBlock.removeClass("vanished");
}

export async function submitParents(): BluebirdPromise<void> {
  const parents = (<string>inputBox.val()).split(" ");
  await setParent(parents);

  window.location.reload();
}
