/*
 * login/begin-reset-password.ts
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

import * as $ from "jquery";
import * as BluebirdPromise from "bluebird";

import { beginResetPassword, confirmResetPassword } from "./../deeds";
import { setCookie } from "./../cookies";

import syncify from "./../utils/syncify";

export default function loadBeginResetPassword(): boolean {
  const beginResetPasswordBlock = $("#begin-reset-password");
  if (beginResetPasswordBlock.length) {
    const codeInputMsg = "We sent you a code via the email address you input. Please check your email.";

    // load inputs
    const emailInput = $("#email");    
    const codeInput = $("#code");
    const resetPasswordMsg = $("#reset-password-msg");
    const submitButton = $("#submit-button");

    const errorMessage = $("#error-message");

    submitButton.click(syncify(async (): BluebirdPromise<void> => {
      const email = <string>emailInput.val();

      try {
        await beginResetPassword(email);

        // if this was successful, hide the email input and show the code input
        errorMessage.empty();
        emailInput.addClass("vanished");
        codeInput.removeClass("vanished");
 
        submitButton.off("click");
        ((em: string) => { submitButton.click(syncify(async (): BluebirdPromise<void> => {
          const code = <string>codeInput.val();

          try {
            await confirmResetPassword(code, em);

            // successful, set email cookie and move on
            setCookie("reset-password-email", em, 7);
            window.location.href = "/reset-password";
          } catch(err) {
            errorMessage.text(err.message);
          }
        })); })(email);
      } catch (err) {
        errorMessage.text(err.message);
      }
    }));

    return true;
  }

  return false;
}
