/*
 * login/register.ts
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

// setup the registration form
import * as $ from "jquery";
import * as BluebirdPromise from "bluebird";

import { register } from "./../deeds";
import { setCookie } from "./../cookies";

import syncify from "./../utils/syncify";

// email regex
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line no-useless-escape

export default function setupRegistration(): boolean {
  const registerBlock = $("#register-form");
  if (registerBlock.length) {
    const usernameInput = $("#username");
    const emailInput = $("#email");
    const cEmailInput = $("#confirm-email");
    const passwordInput = $("#password");
    const cPasswordInput = $("#confirm-password");

    const inputs = [usernameInput, emailInput, cEmailInput, passwordInput, cPasswordInput];

    const emailError = $("#email-error");
    const passwordError = $("#password-error");

    const errorMessage = $("#error-message");

    // reset new elements (e.g. error border)
    const resetElements = function() {
      for (const input of inputs) {
        input.css("border-color", "black");
      }

      emailError.empty();
      errorMessage.empty();
      passwordError.empty(); 
    };

    $("#submit-button").click(syncify(async (): BluebirdPromise<void> => {
      resetElements();

      const username = <string>usernameInput.val();
      const email = <string>emailInput.val();
      const cEmail = <string>cEmailInput.val();
      const password = <string>passwordInput.val();
      const cPassword = <string>cPasswordInput.val(); 

      let isError = false;

      // check for confirmations
      if (email !== cEmail) {
        isError = true;
        $().add(emailInput).add(cEmailInput).css("border-color", "red");
        emailError.text("Emails do not match");
      }

      if (password !== cPassword) {
        isError = true;
        $().add(passwordInput).add(cPasswordInput).css("border-color", "red");
        passwordError.text("Passwords do not match");
      }

      // make sure the email is proper
      if (!isError && !emailRegex.test(email)) {
        isError = true;
        $().add(email).add(cEmail).css("border-color", "red");
        emailError.text("Email is not a valid email address");
      }

      if (isError) {
        return;
      }

      try {
        await register(username, email, password);
        
        setCookie("registration-attempt-email", email, 7);

        // go to confirmation page
        window.location.href = "/sys/confirm-register";
      } catch (err) {
        errorMessage.text(err.message);
      }
    }));

    return true;
  }

  return false;
}
