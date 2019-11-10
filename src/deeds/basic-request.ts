/*
 * deeds/basic-request.ts
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

// this file contains definitions for functions and classes used to make basic requests to the DEEDS function
import * as $ from "jquery";
import * as Cookies from "js-cookie";
import * as nlp from "compromise";
import * as path from "path";

import getSlug from "./../slug";

export type DeedsRequestType = "POST" | "PUT" | "DELETE";

export type DeedsDataTypeSingular = string | number | null;
export type DeedsDataType = DeedsDataTypeSingular | Array<DeedsDataTypeSingular>;

export type DeedsBody = { [key: string]: DeedsDataType };
export type DeedsMethodClass = "page" | "user";

export interface DeedsRequestClass {
  method: string;
  methodClass: DeedsMethodClass;
  requestType: DeedsRequestType;
};

export interface DeedsRequest {
  reqInformation: DeedsRequestClass;
  body: DeedsBody;
};

export interface DeedsErrorResult {
  errType: string;
  error: string;
};

export interface DeedsSuccessResult {
  result: DeedsBody; 
};

export type DeedsResult = DeedsErrorResult | DeedsSuccessResult;

export async function makeDeedsRequest(
  request: DeedsRequest,
  taskDescription: string
): Promise<DeedsSuccessResult> {
  return new Promise((
    resolve: (dsr: DeedsSuccessResult) => void,
    reject: (err: Error) => void
  ) => {
    const uri = path.join("/sys/", request.reqInformation.methodClass, request.reqInformation.method);
    const sentObject = {
      params: request.body,
      sessionId: Cookies.get("sessionId"),
      pagename: getSlug()
    };
    console.log(`uri is ${uri}`);

    const doc = nlp(taskDescription);

    $.ajax(uri, {
      data: sentObject,
      dataType: "JSON",
      method: request.reqInformation.requestType 
    }).done((data: DeedsResult) => {
      if ((<DeedsErrorResult>data).error) {
        // tell what kind of error we have
        const error = (<DeedsErrorResult>data).error;
        const errType = (<DeedsErrorResult>data).errType;
        if (errType === "not-logged-in") {
          // @ts-ignore
          doc.nouns.toPlural();
          reject(new Error(`Must be logged in in order to ${doc.out()}`));
        } else if (errType === "internal-error") {
          reject(new Error("An internal error occurred. Please contact a system administrator."));
        } else {
          reject(new Error(`An error occurred while attempting to ${doc.out()}: ${error}`));
        }
      } else {
        resolve(<DeedsSuccessResult>data);
      }
    }).fail((xhr: any, textStatus: any, errorThrown: any) => {
      let errorMessage = errorThrown;
      if (errorMessage.message) {
        errorMessage = errorMessage.message;
      }
      reject(new Error(`An AJAX error occurred: ${errorMessage}`));
    });
  });
}
