/*
 * test/server/deeds/util.ts
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

// various deeds utilities
import { Request, Response } from "express";
import { runSql } from "./../sql";
import { sessionUser } from "./../session";

// get a page id from a slug
export async function getPageId(slug: string): Promise<number> {
  const res = await runSql(`SELECT pageid FROM Pages WHERE slug=${slug}`);
  return res[0].pageid;
}

// check to see if a session is valid
export function checkValidSession(req: Request, res: Response): boolean {
  const session = req.cookies["session-id"];
  if (session && sessionUser(session) !== -1) {
    return true;
  } else {
    res.json({
      "err-type": "not-logged-in",
      "error": "Session was not found in database"
    });
  }
}
