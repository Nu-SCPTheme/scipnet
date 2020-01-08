/*
 * utils/syncify.ts
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

// there are many instances where an async function needs to be called in a sync way,
// e.g. a click handler. These handlers usually don't care what happens after the promise
// is resolved. This function wraps an async function into a non-async wrapper
import * as BluebirdPromise from "bluebird";

export default function syncify(func: () => Promise<void>): () => void {
  return () => {
    func().then(() => { }).catch((err: Error) => { throw err; });
  };
}
