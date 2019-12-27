/*
 * test/server/deeds/vote.ts
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

import { getPageId } from "./util";
import { runSql } from "./../sql";
import { sessionUser } from "./../session";

// vote on pages
export async function deedsVote(sessionid: string, pageslug: string, rating: number): Promise<void> {
  const userid = sessionUser(sessionid);
  const pageid = await getPageId(pageslug);

  // basically an upsert
  const checkExistanceQuery = `SELECT * FROM Votes WHERE pageid=${pageid} AND userid=${userid};`;
  const insertQuery = `INSERT INTO Votes VALUES (${pageid}, ${userid}, ${rating});`;
  const updateQuery = `UPDATE Votes SET rating=${rating} WHERE pageid=${pageid} AND userid=${userid};`;

  if ((await runSql(checkExistanceQuery)).length) {
    await runSql(updateQuery);
  } else {
    await runSql(insertQuery);
  }
}
