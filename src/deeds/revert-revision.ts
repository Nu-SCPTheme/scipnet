/*
 * deeds/revert-revision.ts
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

// call the DEEDS function to revert to a past revision
import "jquery";

import { DeedsRequestClass, DeedsRequest, DeedsSuccessResult, makeDeedsRequest } from "./basic-request";

const revertRevisionRequestClass: DeedsRequestClass = {
  method: "revert-revision",
  methodClass: "page",
  requestType: "POST"
};

export default async function revertToRevision(revKey: number): Promise<DeedsSuccessResult> {
  const revertRevisionRequest: DeedsRequest = {
    reqInformation: revertRevisionRequestClass,
    body: {
      "rev-key": revKey
    }
  };

  return await makeDeedsRequest(revertRevisionRequest, "revert to past revision");
}

