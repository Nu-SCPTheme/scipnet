/*
 * ajax.ts
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

// ajax functions

// promise polyfill
import "core-js/features/promise";

import { Nullable } from "./utils";

export type AjaxJsonBody = { [key: string]: any };
export type AjaxJsonResult = { [key: string]: any };
export type AjaxPlaintextResult = string;
export type AjaxResult = AjaxJsonResult | AjaxPlaintextResult;

export async function ajaxRequest(
  url: string, 
  body: Nullable<AjaxJsonBody> = null
): Promise<AjaxResult> {
  return new Promise((
    resolve: (res: AjaxResult) => void,
    reject: (err: Error) => void
  ) => {
    function finishedLoad(this: XMLHttpRequest, ev: ProgressEvent) {
      const response = <AjaxResult>(this.response);
      if (this.responseType !== "json" && this.responseType !== "text") {
        // response should be either json or test. anything else means an error has occurred
        reject(new Error("Received unhandled response type from XMLHttpRequest"));
      }
      resolve(response);
    }

    function aborted(ev: ProgressEvent) {
      reject(new Error("AJAX request to server was aborted"));
    }

    function error(ev: ProgressEvent) {
      reject(new Error("An error occurred during the AJAX request"));
    }

    const ajax = new XMLHttpRequest();
    ajax.addEventListener("load", finishedLoad);
    ajax.addEventListener("error", error);
    ajax.addEventListener("abort", aborted);
    
    ajax.open("POST", url);
    ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
   
    ajax.send(new URLSearchParams(body));
  });
}
