/*
 * test/server/sql.ts
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

import * as path from "path";
import * as sqlite from "sqlite3";

import { readFile } from "./promises";

sqlite.verbose();
let db: sqlite.Database;

// load the database from the saved schema
export async function initializeSql(): Promise<void> {
  await new Promise((resolve: () => void, reject: (err: Error) => void) => {
    db = new sqlite.Database(":memory:", (err: Error) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });     
  });

  // db is set, import schema file
  const schemaFile = path.join(__dirname, "data", "db.schema");
  const schema = (await readFile(schemaFile)).toString();
 
  await new Promise((resolve: () => void, reject: (err: Error) => void) => {
    db.all(schema, (err: Error) => {
      if (err) {
        reject(err);
      }

      resolve();
    });
  });
}

// execute a database query
export async function runSql(query: string): Promise<Array<any>> {
  return new Promise((resolve: (res: Array<any>) => void, reject: (err: Error) => void) => {
    db.all(query, (err: Error, rows: Array<any>) => {
      if (err) {
        reject(err);
      }

      resolve(rows);
    });
  });
}

export function closeSql() {
  db.close();
}
