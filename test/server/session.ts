/*
 * test/server/session.ts
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

// keeps track of user sessions
import * as uuid from "uuid/v4";

interface UserSession {
  userid: number;
  sessionid: string;
};

const sessionTable: Array<UserSession> = [];

export function registerSession(userid: number) {
  sessionTable.push({
    userid,
    sessionid: uuid()
  });
}

// get a user by its session id
export function sessionUser(sessionid: string): number {
  for (let i = 0; i < sessionTable.length; i++) {
    if (sessionid === sessionTable[i].sessionid) {
      return sessionTable[i].userid;
    }
  }
  return -1;
}
