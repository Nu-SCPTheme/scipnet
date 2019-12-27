/*
 * widgets/pager.tsx
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

import { h, Component } from "preact";

export type PageSwitchFunction = (page: number) => Promise<void>;

export interface PagerProps {
  onPageSwitch: PageSwitchFunction;
  totalPages: number;
  startPage: number;
};

export interface PagerState {
  currentPage: number;
};

// a button within a pager
interface PagerButtonProps {
  text: string;
  selected: boolean;
}

function PagerButton(props: PagerButtonProps) {
  if (props.selected) {
    return <span class="current">{props.text}</span>;
  } else {
    return <span class="target"><a>{props.text}</a></span>;
  }
}

// pager for switching between pages
export class Pager extends Component<PagerProps, PagerState> {
  constructor(props: PagerProps) {
    super(props);
   
    this.state = {
      currentPage: this.props.totalPages
    }
  }

  // default properties
  static get defaultProps(): PagerProps {
    return {
      onPageSwitch: Promise.resolve,
      totalPages: 1,
      startPage: 0
    }
  }

  doPageSwitch(page: number) {
    this.onPageSwitch(page).then(() => {
      this.setState((state: PagerState): PagerState) => {
        return { currentPage: page };
      });
    });
  }

  render() {
    // configurable constants
    const numPagesFromCurrent = 2;
    const numAtBeginning = 2;
    const numAtEnd = 0;
    
    const pageNum = this.state.currentPage;

    let selectedPages = [];
    for (let i = 0; i <= numPagesFromCurrent; i++) {
      selectedPages.push(pageNum + i);
      if (i !== 0) {
        selectedPages.push(pageNum - i);
      }
    }
    selectedPages = selectedPages.filter((x: number): boolean => x >= 0 && x < totalPageNum); 

    // generate the "previous" button
    if (selectedPages[0] !== pageNum) {
      createButton("« previous", false, pageNum - 1); 
    }

    const prevButton = selectedPages[0] !== pageNum
      ? <PagerButton text="« previous" selected={false} onClick={() => this.doPageSwitch(pageNum - 1)}/>
      : "";

    const nextButton = selectedPages[selectedPages.length - 1] !== pageNum
      ? <PagerButton text="next »" selected={false} onClick={() => this.doPageSwtich(pageNum + 1)}/>
      : "";

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

    return (
      <div class="pager">
        <span class="pager-no">{pageNum}</span>
        {prevButton}
        {
          selectedPages.map((pageDest: number) => {
            return <PagerButton text={`${pageDest}`}
                                selected={pageDest === pageNum}
                                onClick={() => this.doPageSwitch(pageDest)}
                    />;
          });
        }
        {nextButton}
      </div>
    );
  }
}
