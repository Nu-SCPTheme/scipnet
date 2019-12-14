/*
 * account-options.ts
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

// assigns trigger to the account options button
import * as $ from "jquery";
import * as BluebirdPromise from "bluebird";

export default function setupAccountOptions() {
  const accountButton = $("#account-topbutton");
  if (accountButton.length) {
    const accountOptions = $("#account-options");
   
    let currentlyDisplaying = false;

    const showAccountOptions = () => {
      accountOptions.css("display", "block");
      currentlyDisplaying = true;
      accountButton.off("click");
    };
 
    // hide options when no longer hovering
    // TODO: mobile support
    accountOptions.hover(() => {}, () => {
      if (currentlyDisplaying) {
        accountOptions.css("display", "none");
        currentlyDisplaying = false;
        accountButton.click(showAccountOptions);
      }
    });
    accountButton.click(showAccountOptions);
  }
}
