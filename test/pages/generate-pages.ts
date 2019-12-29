/*
 * test/pages/generate-pages.ts
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

// uses Nunjucks to generate the pages
import * as fs from "fs";
import * as nunjucks from "nunjucks";
import * as path from "path";

import { promisify } from "util";

import mochaify from "./add-mocha";

// promises
const readFile = promisify(fs.readFile);

export enum PageType {
  TypicalPage="Typical Page",
  Login="login.html",
  Register="register.html",
  ConfirmRegister="confirm-register.html",
  BeginResetPassword="begin-reset-password.html",
  ResetPassword="reset-password.html"
};

// user info base type
import { UserInfo } from "./../../src/user/info";

nunjucks.configure({ autoescape: false });

export async function generatePage(pageType: PageType, loginModule: string | null): Promise<string> {
  const stored_user_info: Array<UserInfo> = [
    {
      userid: 42,
      username: "test-user-1",
      "profile-picture-url": "/testing/pfp-urls/1.png"
    },
    {
      userid: 62,
      username: "test-user-2",
      "profile-picture-url": "/testing/pfp-urls/2.png"
    }
  ];

  // read all of the pages before we need them
  const readData = async (n: string): Promise<string> => (await readFile(path.join(__dirname, "data", n))).toString();
  const neededPageReads = await Promise.all([
    readData("template.j2"),
    readData("topbar.j2"),
    readData("sidebar.j2"),
    readData(pageType === PageType.TypicalPage ? "typical-page.j2" : pageType)
  ]);

  const nunjucksReplacement = {
    stored_user_info,
    meta_title: pageType,
    site_name: "SCP Foundation",
    site_subtext: "Secure. Contain. Protect.",
    my_user_module: loginModule,
    message_count: 2,
    side_bar: neededPageReads[2],
    top_bar: neededPageReads[1],
    content: neededPageReads[3],
    tags: pageType === PageType.TypicalPage ? ["scp", "render", "madness"] : [],
    rating: 0,
    page_info: "Test Info",
		page_watch_options: "Watch?",
		licensing_info: "CC-BY-SA-3.0"
  };

  return mochaify(nunjucks.renderString(neededPageReads[0], nunjucksReplacement));
}
