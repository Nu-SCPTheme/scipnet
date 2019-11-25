/*
 * edit.ts
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

// functions for editing the page
import * as $ from "jquery";
import * as BluebirdPromise from "bluebird";

import getSource from "./../deeds/get-source";
import setSource from "./../deeds/post-source";
import setEditLock from "./../deeds/edit-lock";

export async function beginEditPage(): BluebirdPromise<void> {
  // first, set up an edit lock
  const editLockSeconds = (await setEditLock()).result["edit-lock-seconds"];

  // then, get the current page's source
  const source = (await getSource()).result.src;
  
  // open up the part of the page with the editor and fill in the source 
  $("#edit-source-box").val(<string>source);
  $("#utility-edit-block").removeClass("vanished");
}

export async function savePage(refresh: boolean): BluebirdPromise<void> {
  const src = <string>$("#edit-source-box").val();
  const title = <string>$("#edit-title-box").val();
  const comment = <string>$("#edit-comment-box").val();

  await setSource(src, title, comment);

  if (refresh) {
    window.location.reload();
  }
}
