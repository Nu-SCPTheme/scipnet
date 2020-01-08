/*
 * login/index.ts
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

// this function will simply run all of the other functions within this folder
import loadBeginResetPassword from "./begin-reset-password";
import setupConfirmRegistration from "./confirm-register";
import setupResetPassword from "./reset-password";
import setupLogin from "./login";
import setupRegistration from "./register";

export default function setupAuth() {
  if (loadBeginResetPassword()) return;
  if (setupResetPassword()) return;
  if (setupConfirmRegistration()) return;
  if (setupLogin()) return;
  if (setupRegistration()) return;
}
