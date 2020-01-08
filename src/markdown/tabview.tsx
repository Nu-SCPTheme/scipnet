/*
 * tabview.ts
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

import * as $ from "jquery";

import { h, render, Component } from "preact";

interface Tab {
  header: string;
  contents: Element[];
}

export interface TabviewProps {
  tabs: Tab[];
}

export interface TabviewState {
  currentTab: number;
}

// a tabview
export class Tabview extends Component<TabviewProps, TabviewState> {
  innerRef: HTMLElement | null;

  constructor(props: TabviewProps) {
    super(props);

    this.innerRef = null;

    this.state = {
      currentTab: 0
    }
  }

  updateInnerRef() {
    if (this.innerRef) {
      this.innerRef.innerHTML = "";
      for (const elem of this.props.tabs[this.state.currentTab].contents) {
        this.innerRef.appendChild(elem);
      }
    }
  }

  setInnerRef(ref: HTMLElement | null) {
    this.innerRef = ref;
    this.updateInnerRef();
  }

  componentDidUpdate(prevProps: TabviewProps, prevState: TabviewState) {
    if (prevState.currentTab !== this.state.currentTab) {
      this.updateInnerRef();
    }
  }

  updateTab(newNumber: number) {
    this.setState(s => Object.assign({}, s, { currentTab: newNumber }));
  }

  render() {
    const tabsels = [];
    for (let i = 0; i < this.props.tabs.length; i++) {
      const tab = this.props.tabs[i];
      const isActive = this.state.currentTab === i;
      tabsels.push(
        <li class={`tab-selector ${isActive ? "active" : ""}`} onClick={() => this.updateTab(i)}>
          <a title={ isActive ? "Active" : "" }>{tab.header}</a>
        </li>
      );
    }

    return (
      <div class="tabview">
        <ul class="tab-selectors">
          { tabsels }
        </ul>
        <div class="tab-container">
          <div class="tab-content" ref={this.setInnerRef.bind(this)}>
	  </div>
        </div>
      </div>
    );
  }
}

export default function tabviewSetup() {
  $(".ftml--tabview").each(function(this: HTMLElement) {
    const jThis = $(this);
    const tabs = Array.prototype.slice.call(jThis.find("div"))
      .map((el: HTMLElement) => {
        return {
          header: $(el).attr("data-tabheader"),
          contents: Array.prototype.slice.call(el.children)
	};
      });

    jThis.empty();
    render(<Tabview tabs={tabs} />, this);
  }); 
}
