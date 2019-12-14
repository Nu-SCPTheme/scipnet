/*
 * login/confirm-register.ts
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

// setup the form to confirm registration
import * as Cookies from "js-cookie";
import * as $ from "jquery";
import * as BluebirdPromise from "bluebird";

import { confirmRegistration } from "./../deeds";
import syncify from "./../utils/syncify";

const noConfEmail = 
  `<p>
     An error occurred while attempting to retrieve a confirmation email. <a href="/">Return to the home page</a>.
   </p>`;

const enterCodeBegin = "Please enter the code recieved by the email address ";
const enterCodeEnd = " into to finish registering your account.";

export default function loadConfirmRegistration(): boolean {
  const crBlock = $("#confirm-register-form");
  if (crBlock.length) {
    // check to see if there is a registration attempt cookie
    const email = <string>Cookies.get("registration-attempt-email");
    if (!email) {
      crBlock.html(noConfEmail);
      return; 
    }

    const crMessage = $("#confirm-register-message");
    const crInputBox = $("#register-code-box");

    const errorMessage = $("#error-message");
    
    crMessage.text([enterCodeBegin, email, enterCodeEnd].join(""));

    $("#submit-button").click(syncify(async (): BluebirdPromise<void> => {
      try {
        await confirmRegistration(<string>crInputBox.val(), email);

        // we're logged in
        window.location.href = "/sys/login";
      } catch (err) {
        errorMessage.text(err.message); 
      }
    }));

    return true;
  }

  return false;
}
