/*
 * deeds.ts
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

// function to interact with "deeds" AJAX request system
import "core-js/features/promise";

import { ajaxRequest, AjaxJsonBody, AjaxJsonResult } from "./ajax";
import Cookies = require("js-cookie");
import getSlug from "./slug";

const pagereqSlug = "/sys/pagereq";

export default async function deeds(
  name: string,
  body: AjaxJsonBody, 
): Promise<any> {
  // check for login
  body.name = name;
  
  const sessionId = Cookies.get("sessionId");
  body.sessionId = sessionId;
  body.pagename = getSlug();

  const res = await ajaxRequest(pagereqSlug, body);
  if (!(res instanceof String)) {
    return res; 
  }
  throw new Error(`Expected JSON object, but instead got string ${res}`);
}
