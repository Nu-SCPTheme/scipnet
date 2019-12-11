/*
 * deeds/deeds-function.ts
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

// hot-create functions based off of requests.json
import {  
  DeedsMethodClass, 
  DeedsRequestType,
  DeedsSuccessResult, 
  makeDeedsRequest 
} from "./basic-request";

import * as BluebirdPromise from "bluebird";

export interface DeedsParameter {
  "name": string;
  "type": string;
  "param-name"?: string;
}

export interface DeedsFunctionSummary {
  name: string;
  method: string;
  "method-class": DeedsMethodClass;
  "request-type": DeedsRequestType;
  "singular-verb": string;
  "plural-verb": string; 
  body: Array<DeedsParameter>;
}

export function createDeedsFunction(summary: DeedsFunctionSummary): Function {
  // pre load function with needed variables
  let deedsFunction = ((
    method: string,
    methodClass: DeedsMethodClass,
    requestType: DeedsMethodType,
    singularVerb: string,
    pluralVerb: string,
    body: Array<DeedsParameter>
  ) => {
    return async (...args: Array<any>): BluebirdPromise<DeedsSuccessResult> => {
      let reqBody = {};
      let i = 0;
      for (const parameter of body) {
        reqBody[parameter.name] = args[i];
        i++;
      }
 
      return await makeDeedsRequest({
        reqInformation: { method, methodClass, requestType },
        body: reqBody
      }
    };
  }(
    summary.method, 
    summary["method-class"], 
    summary["request-type"],
    summary["singular-verb"],
    summary["plural-verb"],
    summary.body
  ));
  deedsFunction.name = summary.name;
  return deedsFunction;
}
