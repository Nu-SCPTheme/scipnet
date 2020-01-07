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
import * as definition from "../../locales/en.json";

import { h, Component } from "preact";
import { IntlProvider, Text as IntlText } from "preact-i18n";

export type PageSwitchFunction = (page: number) => Promise<void>;

export interface PagerProps {
  onPageSwitch: PageSwitchFunction;
  totalPages: number;
  startPage: number;
};

export interface PagerState {
  currentPage: number;
};

enum PagerButtonType {
  Next,
  Previous,
  Num
}

// a button within a pager
interface PagerButtonProps {
  onClick: () => void;
  selected: boolean;
  text: string;
  buttonType: PagerButtonType;
}

function PagerButton(props: PagerButtonProps) {
  if (props.selected) {
    return <span class="current" onClick={props.onClick}>{props.text}</span>;
  } else {
    let innerText;
    if (props.buttonType === PagerButtonType.Num) {
      innerText = props.text;
    } else {
      const label = props.buttonType === PagerButtonType.Next ? "next" : "previous";
      innerText = <IntlText id={`pager/${label}`}>{props.text}</IntlText>;
    }
    return <span class="target"> onClick={props.onClick}<a>{innerText}</a></span>;
  }
}

// pager for switching between pages
export class Pager extends Component<PagerProps, PagerState> {
  constructor(props: PagerProps) {
    super(props);
   
    this.state = {
      currentPage: this.props.startPage
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
    this.props.onPageSwitch(page).then(() => {
      this.setState((state: PagerState): PagerState => {
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
    selectedPages = selectedPages.filter((x: number): boolean => x >= 0 && x < this.props.totalPages); 

    // create the buttons that enable page-switching
    const prevButton = selectedPages[0] !== pageNum
      ? <PagerButton text="« previous" 
                     buttonType={PagerButtonType.Previous} 
                     selected={false} 
                     onClick={() => this.doPageSwitch(pageNum - 1)}/>
      : "";

    const nextButton = selectedPages[selectedPages.length - 1] !== pageNum
      ? <PagerButton text="next »" 
                     buttonType={PagerButtonType.Next}
                     selected={false} 
                     onClick={() => this.doPageSwitch(pageNum + 1)}/>
      : "";

    const mainButtons = selectedPages.map((pageDest: number) => 
      <PagerButton text={`${pageDest}`}
                   buttonType={PagerButtonType.Num}
                   selected={pageDest === pageNum}
                   onClick={() => this.doPageSwitch(pageDest)}
      />
    );

    return (
      <IntlProvider definition={definition}>
        <div class="pager">
          <span class="pager-no">{pageNum}</span>
          {prevButton}
          {mainButtons}
          {nextButton}
        </div>
      </IntlProvider>
    );
  }
}
