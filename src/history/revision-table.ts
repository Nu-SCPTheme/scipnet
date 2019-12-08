/*
 * history/revision-table.ts
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

/* eslint indent: 0 */

// function for creating a table of revisions
// split from history/index.ts for space reasons
import * as $ from "jquery";

import { Revision } from "./revision";

export default function createRevisionList(revisions: Array<Revision>, frame: JQuery) {
  // create basic table
  const tbody = $("<tbody></tbody>").appendTo($("<table class=\"page-history\"></table>").appendTo(frame))
                  .append($("<tr></tr>") // row containing headers
                    .append($("<td>rev.</td>"))
                    .append($("<td>&nbsp;</td>"))
                    .append($("<td>flags</td>"))
                    .append($("<td>actions</td>"))
                    .append($("<td>by</td>"))
                    .append($("<td>date</td>"))
                    .append($("<td>comments</td>"))
                  );

  // iterate thru revisions to create rows
  let editedOn;
  let revKey;
  for (const revision of revisions) {
    editedOn = revision.editedOn;
    revKey = revision.revKey;
    $(`<tr id="revision-${revKey}"></tr>`)
      // the number of the revision
      .append($(`<td>${revision.revId}. </td>`))
      // the two radio buttons that determine which revisions to compare
      .append(((): JQuery => {          
        const cell = $("<td></td>");
        for (let i = 0; i < 2; i++) {
          $(`<input type="radio" id="${revKey}" value="${revKey}"></input>`)
            .attr("name", i === 0 ? "from" : "to")
            .appendTo(cell);
        }
        return cell;
      })())
      // revision flag
      .append($(`<td>${revision.flag}</td>`))
      // TODO: action buttons
      .append($("<td></td>"))
      // date on which the revision occured (TODO: standardize this)
      .append($(`<td>${editedOn.getMonth()} ${editedOn.getDay()} ${editedOn.getFullYear()}`))
      // revision comment
      .append($(`<td>${revision.comment}</td>`))
      .appendTo(tbody);
  }
}
