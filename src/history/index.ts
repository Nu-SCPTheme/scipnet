/*
 * history/index.ts
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

// contains methods for geting and converting page history, as well as a widget
import * as $ from "jquery";
import * as BluebirdPromise from "bluebird";

import { classMethodToClosure, Nullable } from "./../utils";
import { Pager } from "./../widgets/pager";
import { Revision } from "./revision";

import createRevisionList from "./revision-table";
import { getHistory } from "./../deeds";

const revisionsPerPageOptions = [
  10,
  20,
  50,
  100,
  200
];

// note: this is a singleton, so only one instance should exist at once
export class HistoryWidget {
  revisions: Array<Revision>;
  page: number;
  revisionsPerPage: number;
  totalPages: number;

  // dom elements
  pager: Pager;
  selector: JQuery;
  revisionList: JQuery;

  private static instance: HistoryWidget;

  private constructor(
    private frame: JQuery
  ) { 
    this.revisions = [];
    this.page = 0;
    this.revisionsPerPage = 20;

    // initialize the widget's HTML
    this.frame.html(
      `<form id="utility-history-block">
         <table class="form">
           <tbody>
             <tr>
               <td>Revisions per page:</td>
               <td>
                 <select id="rev-per-page">
                 </select>
               </td>
             </tr>
           </tbody>
         </table>
         <div id="buttons">
           <input id="update-button"
                  class="btn btn-default btn-sm"
                  type="button"
                  value="Update List" />
           <input id="compare-button"
                  class="btn btn-default btn-sm"
                  type="button"
                  value="Compare versions" />
         </div>
         <div id="revision-list"></div>
       </form>`
    );

    // setup revisions per page selection box
    let isFirst = true;
    this.selector = this.frame.find("#rev-per-page");
    for (const rPP of revisionsPerPageOptions) {
      const option = $("<option>").html(`${rPP}`).attr("value", rPP).appendTo(this.selector);
      if (isFirst) {
        option.attr("selected", "selected");
        isFirst = false; 
      }
    }

    this.revisionList = this.frame.find("#revision-list");

    // other things are async and are set up in another function
  }

  public static async getInstance(frame: JQuery): BluebirdPromise<HistoryWidget> {
    if (HistoryWidget.instance) {
      HistoryWidget.instance.page = 0;
      await HistoryWidget.instance.renderWidget();
      return HistoryWidget.instance;
    }
    
    HistoryWidget.instance = new HistoryWidget(frame);
    await HistoryWidget.instance.renderWidget();
    return HistoryWidget.instance;
  }

  // setup the revision list and other async elements
  async renderWidget(): BluebirdPromise<void> {
    // first, set this.revisionsPerPage based on the selector's value
    this.revisionsPerPage = parseInt(<string>this.selector.find("option:selected").val(), 10);

    // then, load revision data
    await this.loadRevisions();

    // then, render the pager and the revision list
    this.revisionList.empty();
    this.createPager();
    this.createRevisionTable();
  }

  // load a list of revisions
  async loadRevisions(): BluebirdPromise<void> {
    const { result } = await getHistory(this.page, this.revisionsPerPage);
    
    this.revisions = $.map(result.revisions, (revision: any): Revision => {
      return Revision.deserialize(revision);
    }).filter((revision: Revision): boolean => !revision.isCompromised);
    this.totalPages = <number>result.totalPages;
  }

  // setup the page-switching widget
  private createPager() {
    const pagerFrame = $("<div class=\"pager\"></div>").appendTo(this.revisionList);
    if (!this.pager) {
      this.pager = new Pager(
        pagerFrame, 
        <any>classMethodToClosure(this, "switchToPageSync"),
        this.totalPages,
        this.page
      );
    } else {
      this.pager.renderPager(this.page, this.totalPages);
    }
  }

  // switch to another page
  async switchToPage(page: number): BluebirdPromise<void> {
    this.page = page;
    this.renderWidget();
  }

  // switch to another page, but as a synchronous function
  switchToPageSync(page: number) {
    this.switchToPage(page).then(() => { }).catch((err: Error) => { throw err; });
  }

  // create the table for the revisions
  private createRevisionTable() {
    createRevisionList(this.revisions, this.revisionList);
  }
}
