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

import cancelEditLock from "./../deeds/cancel-edit-lock";
import closeUtilities from "./hide-all";
import getSource from "./../deeds/get-source";
import setSource from "./../deeds/post-source";
import setEditLock from "./../deeds/edit-lock";

let currentlyTyping = false;
let editlockTimeout: ReturnType<typeof setTimeout>;

// set timeout notification
function setTimeoutNotification(secondsLeft: number) {
  $("#edit-editlock-notification")
    .html(`<b>Your edit lock will expire in ${secondsLeft} seconds.</b>`);

  if (secondsLeft > 0 && !currentlyTyping) {
    editlockTimeout = setTimeout(() => {
      setTimeoutNotification(secondsLeft - 1);
    }, 1000);
  }
}

export async function beginEditPage(): BluebirdPromise<void> {
  closeUtilities();

  // first, set up an edit lock
  const editLockSeconds = (await setEditLock()).result["edit-lock-seconds"];

  // then, get the current page's source
  const source = (await getSource()).result.src;
  
  // open up the part of the page with the editor and fill in the source 
  $("#edit-source-box").val(<string>source);
  setTimeoutNotification(<number>editLockSeconds);
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

export async function cancelEditPage(): BluebirdPromise<void> {
  await cancelEditLock();

  clearTimeout(editlockTimeout);
  closeUtilities();
}

let keyTimer: ReturnType<typeof setTimeout>;
const stopInterval = 200;

// reset the edit lock
async function resetEditLock(): BluebirdPromise<void> {
  const elSeconds = (await setEditLock()).result["edit-lock-seconds"];
  setTimeoutNotification(<number>elSeconds);
}

function resetEditLockSync() {
  resetEditLock().then(() => { }).catch((err: Error) => { throw err; });
}

// setup to reset editlock after user has not typed for some time
export function setupEditLockTrigger() {
  $("#edit-source-box").keyup(() => {
    clearTimeout(keyTimer);
    keyTimer = setTimeout(resetEditLockSync, stopInterval);
  }).keydown(() => {
    clearTimeout(keyTimer);
  });
}
