/*
 * page-utils/index.ts
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
import * as $ from "jquery";
import * as BluebirdPromise from "bluebird";

import closeUtilities from "./hide-all";

import { beginEditPage, cancelEditPage, savePage, setupEditLockTrigger } from "./edit";
import { clearTags, openTagBlock, submitTags } from "./tags";
import { nonIntrusiveDialog } from "./../dialog";
import { openHistoryBlock } from "./history";
import { openPageSourceBlock } from "./page-source";
import { openParentBlock, submitParents } from "./parent";
import { openRatingBlock, ratePage } from "./rating";
import { openRenameBlock, renamePage } from "./rename";

// wrap promises related to page utils
// NOTE: not using syncify to take advantage of nonIntrusiveDialog function
function promiseWrapper(func: () => BluebirdPromise<void>): () => void {
  return function() {
    func().then(() => {}).catch((err: Error) => {
      nonIntrusiveDialog("Error", err.message);
    });
  };
}

// setup rating trigger
function setupRatingTrigger(className: string, rating: number) {
  $(".page-rate-widget-box")
    .find(`.${className}`)
    .find("a")
    .click(promiseWrapper(async (): BluebirdPromise<void> => {
      await ratePage(rating);
    }));
}

// setup triggers for page utilities
export default function setupPageUtils() {
  setupRatingTrigger("rateup", 1);
  setupRatingTrigger("ratedown", -1);
  setupRatingTrigger("cancel", 0);

  setupEditLockTrigger();

  // add triggers to utility links
  $("#utility-edit-link").click(promiseWrapper(beginEditPage));
  $("#utility-history-link").click(promiseWrapper(openHistoryBlock));
  $("#utility-parent-link").click(promiseWrapper(openParentBlock));
  $("#utility-pagesrc-link").click(promiseWrapper(openPageSourceBlock));
  $("#utility-rating-link").click(openRatingBlock);
  $("#utility-rename-link").click(openRenameBlock);
  $("#utility-tags-link").click(promiseWrapper(openTagBlock));

  // add triggers to editor
  $("#edit-cancel-button").click(promiseWrapper(cancelEditPage));
  $("#edit-sac-button").click(promiseWrapper(async (): BluebirdPromise<void> => {
    await savePage(false);
  }));
  $("#edit-save-button").click(promiseWrapper(async (): BluebirdPromise<void> => {
    await savePage(true);
  }));

  // add triggers to tagger
  $("#tags-submit-button").click(promiseWrapper(submitTags));
  $("#tags-clear-button").click(clearTags);
  $("#tags-cancel-button").click(closeUtilities);

  // add triggers to parent editor
  $("#parent-submit-button").click(promiseWrapper(submitParents));
  $("#parent-cancel-button").click(closeUtilities);

  // add triggers to renamer
  $("#rename-submit-button").click(promiseWrapper(renamePage));
  $("#rename-cancel-button").click(closeUtilities);
}
