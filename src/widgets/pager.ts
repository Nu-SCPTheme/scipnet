/*
 * widgets/pager.ts
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
 **/

import * as $ from "jquery";
import * as BluebirdPromise from "bluebird";

export class Pager {
  private pager: JQuery;

  constructor(
    private frame: JQuery,
    private pageSwitchFunction: (page: number) => void, 
    private totalPages: number,
    private startPage: number = 0
  ) {
    this.renderPager(this.startPage, this.totalPages);
  }

  renderPager(pageNum: number, totalPageNum: number) {
    // configurable constants
    const numPagesFromCurrent = 2;
    const numAtBeginning = 2;
    const numAtEnd = 0;

    let selectedPages = [];
    for (let i = 0; i <= numPagesFromCurrent; i++) {
      selectedPages.push(pageNum + i);
      if (i !== 0) {
        selectedPages.push(pageNum - i);
      }
    }
    selectedPages = selectedPages.filter((x: number): boolean => x >= 0 && x < totalPageNum); 
 
    // empty the frame
    this.frame.empty(); 

    // create a button within a pager
    const that = this;
    function createButton(text: string, selected: boolean, destPage: number): JQuery {
      let textElem; 
      if (selected) {
        textElem = $(`<span>${text}</span>`);
      } else {
        textElem = $(`<a>${text}</a>`).click(() => { that.pageSwitchFunction(destPage); });
      }

      return textElem.appendTo(
        $("<span></span>")
          .addClass(selected ? "current" : "target")
          .appendTo(that.pager)
      );
    }

    // generate the "previous" button
    if (selectedPages[0] !== pageNum) {
      createButton("« previous", false, pageNum - 1); 
    }

    // generate the first two page numbers, if applicable
    // TODO: fix this when I have time
    /*if (selectedPages[0] >= numAtBeginning) {
      for (let i = 0; i < numAtBeginning; i++) {
        createButton(`${i + 1}`, false, classMethodToClosure(this, "switchToPage", i));
      }

      if (selectedPages[0] > numAtBeginning) {
        $(`<span class="dots">. . .</span>`).appendTo(this.pager);
      }
    }*/

    // generate numbers for selected pages
    for (const selectedPage of selectedPages) {
      const isCurrentPage = selectedPage === pageNum;

      createButton(
        `${selectedPage + 1}`, 
        isCurrentPage,
        selectedPage
      );
    }

    if (selectedPages[selectedPages.length - 1] !== pageNum) {
      createButton("next »", false, pageNum + 1);
    }
  }
}
