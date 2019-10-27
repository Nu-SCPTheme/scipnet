/*
 * post.ts
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


export type PostParams = { [key: string]: string };

// create a form element to send a post request with
export function createPostForm(url: string, params: PostParams) {
  const form = document.createElement("form");
  form.method = "post";
  form.action = url;

  // loop through params
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      let hiddenField = document.createElement("input");
      hiddenField.type = "hidden";
      hiddenField.name = key;
      hiddenField.value = params[key];
      
      form.appendChild(hiddenField);
    }
  }

  form.classList.add("vanished");
  document.body.appendChild(form);
  return form;
};

// taken from https://stackoverflow.com/a/133997/11187995
export function sendPostData(url: string, params: PostParams) {
  const form = createPostForm(url, params);
  form.submit();
}
