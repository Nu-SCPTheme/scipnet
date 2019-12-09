/*
 * login/login.ts
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

// setup for the login form
import * as Cookies from "js-cookie";
import * as $ from "jquery";
import * as BluebirdPromise from "bluebird";

import login from "./../deeds/login";
import syncify from "./../utils/syncify";

export default function setupLogin() {
  const loginBlock = $("#login-form");
  if (loginBlock.length) {
    const usernameInput = $("#username");
    const passwordInput = $("#password");
    const rememberMe = $("#remember-me");
  
    const errorMessage = $("#error-message");

    $("#submit-button").click(syncify(async (): BluebirdPromise<void> => {
      try {
        const { result } = await login(<string>usernameInput.val(), <string>passwordInput.val());
        const authSession = <string>result["auth-session"];
        const cookiePreserveTime = <number>result["cookie-preserve-time"];

        Cookies.set("auth-session", authSession, { expires: cookiePreserveTime });

        // reload to main page
        window.location.href = "/";
      } catch (err) {
        // deeds/basic-request already formats the errors for us
        errorMessage.text(err.message);
      }
    }));
  }
}
