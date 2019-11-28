/*
 * deeds/cancel-edit-lock.ts
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

// call the DEEDS function for cancelling an edit lock the user has
import "jquery";
import * as BluebirdPromise from "bluebird";

import { DeedsRequestClass, DeedsRequest, DeedsSuccessResult, makeDeedsRequest } from "./basic-request";

const cancelEditLockRequestClass: DeedsRequestClass = {
  method: "cancel-edit-lock",
  methodClass: "page",
  requestType: "POST"
};

export default async function cancelEditLock(): BluebirdPromise<DeedsSuccessResult> {
  const cancelEditLockRequest: DeedsRequest = {
    reqInformation: cancelEditLockRequestClass,
    body: { }
  };

  return await makeDeedsRequest(cancelEditLockRequest, "cancel edit lock", "cancel edit locks");
}
