/*
 * cookies.ts
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

// a quick framework for getting, setting, and deleting cookies
import { Nullable } from "./utils";

// TODO: encode() and decode() might become obsolete in future ECMA's, replace w/ something else?

// toGMTString may not exist on Date types in the future, we can fix this
// using ts-ignore to get around Typescript thinking it does not exist
// @ts-ignore
if (!Date.prototype.toGMTString) {
  // @ts-ignore
  Date.prototype.toGMTString = Date.prototype.toUTCString;
}

// set a cookie
export function setCookie(name: string, value: string, expireDays: number) {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + expireDays);

  const escapedValue = escape(value);
  // @ts-ignore
  const cookie = `${name}=${value}; expires=${expiry.toGMTString()}`;
  document.cookie = cookie;
}

// get a cookie
export function getCookie(name: string): Nullable<string> {
  if (document.cookie.length > 0) {
    // find position of cookie in total cookies
    let offset = document.cookie.indexOf(`${name}=`);
    if (offset === -1) {
      return null;
    }

    // to find the value, add the length of the name + 1 for the = sign
    offset += name.length + 1;
    
    // find the end of the value
    let end = document.cookie.indexOf(";", offset);
    if (end === -1) {
      // set end to the end of the document
      end = document.cookie.length;
    }

    return unescape(document.cookie.substring(offset, end));
  }
  return null;
}

// @ts-ignore
const alreadyExpiredDate = new Date(0).toGMTString();

// delete a cookie
export function deleteCookie(name: string) {
  // the method used here is to set the cookie to expire instantly
  if (document.cookie.indexOf(`${name}=`) !== -1) {
    document.cookie = `${name}=; expires=${alreadyExpiredDate}`;
  }
}
