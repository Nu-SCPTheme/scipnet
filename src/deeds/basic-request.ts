/*
 * deeds/basic-request.ts
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

// this file contains definitions for functions and classes used to make basic requests to the DEEDS function
import * as $ from "jquery";
import * as path from "path";
import * as BluebirdPromise from "bluebird";

import getSlug from "./../slug";
import { Nullable } from "./../utils";
import { UserInfo } from "./../user/info";

export type DeedsRequestType = "GET" | "POST" | "PUT" | "DELETE";

export type DeedsDataTypeSingular = string | number | boolean | UserInfo | null;
export type DeedsArrayDataType = Array<DeedsDataTypeSingular>;
export type DeedsDictDataType = { [key: string]: DeedsDataTypeSingular | DeedsArrayDataType };
export type DeedsDataType = DeedsDataTypeSingular | DeedsArrayDataType | DeedsDictDataType;

export type DeedsBody = { [key: string]: DeedsDataType };
export type DeedsMethodClass = "auth" | "page" | "user";

export interface DeedsRequestClass {
  method: string;
  methodClass: DeedsMethodClass;
  requestType: DeedsRequestType;
}

export interface DeedsRequest {
  reqInformation: DeedsRequestClass;
  body: DeedsBody;
}

export interface DeedsErrorResult {
  "err-type": string;
  error: string;
}

export interface DeedsSuccessResult {
  result: DeedsBody; 
}

export type DeedsResult = DeedsErrorResult | DeedsSuccessResult;

export async function makeDeedsRequest(
  request: DeedsRequest,
  taskDescription: string,
  taskDescriptionPlural: string
): BluebirdPromise<DeedsSuccessResult> { 
  const uri = `/sys/${request.reqInformation.methodClass}/${request.reqInformation.method}`;

  let sentObject = {
    params: request.body,
    pagename: <Nullable<string>>null
  };
   
  // set additional needed parameters
  if (request.reqInformation.methodClass === "page") { 
    sentObject.pagename = getSlug();
  }

  // send AJAX request
  let res;
  try {
    res = await $.ajax(uri, {
      data: sentObject,
      dataType: "JSON",
      method: request.reqInformation.requestType 
    });
  } catch(err) {
    let errorMessage = err;
    if (errorMessage.message) {
      errorMessage = errorMessage.message;
    }
    throw new Error(`An AJAX error occured: ${errorMessage}`);
  }
 
  if ((<DeedsErrorResult>res).error) {
    // tell what kind of error we have
    const error = (<DeedsErrorResult>res).error;
    const errType = (<DeedsErrorResult>res)["err-type"];
    if (errType === "not-logged-in") {
      throw new Error(`Must be logged in in order to ${taskDescriptionPlural}`);
    } else if (errType === "internal-error") {
      throw new Error("An internal error occurred. Please contact a system administrator.");
    } else {
      throw new Error(`An error occurred while attempting to ${taskDescription}: ${error}`);
    }
  } else {
    return <DeedsSuccessResult>res;
  }
}
