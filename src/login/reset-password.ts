/*
 * login/reset-password.ts
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

import * as $ from "jquery";
import * as BluebirdPromise from "bluebird";

import { deleteCookie, getCookie } from "./../cookies";
import { resetPassword } from "./../deeds";

import syncify from "./../utils/syncify";

// form to finish the password reset process
export default function setupResetPassword(): boolean {
  const resetPasswordBlock = $("#reset-password");
  if (resetPasswordBlock.length) {
    const newPasswordInput = $("#new-password");
    const cNewPasswordInput = $("#confirm-new-password");

    const email = getCookie("reset-password-email");
 
    const errorMessage = $("#error-message");

    $("#submit-button").click(syncify(async (): BluebirdPromise<void> => {
      const newPassword = <string>newPasswordInput.val();
      const cNewPassword = <string>cNewPasswordInput.val();

      if (newPassword !== cNewPassword) {
        errorMessage.text("Passwords do not match");
        return;
      }

      try {
        await resetPassword(email, newPassword);
        deleteCookie("reset-password-email");
        window.location.href = "/login";
      } catch (err) {
        errorMessage.text(err.message);
      }
    }));

    return true;
  }

  return false;
}
