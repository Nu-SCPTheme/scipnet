/*
 * collapsible.ts
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

// code to make collapsibles work
import * as $ from "jquery";
import * as BluebirdPromise from "bluebird";

import { h, render, Component } from "preact";

export interface CollapsibleProps {
  openlink: string;
  closelink: string;
  linkLocation: number;
  contents: Element[];
}

export interface CollapsibleState {
  show: boolean;
  contentOpacity: number;
}

const openTime = 500;
const interval = 5;
const opacityIncrement = 1 / (openTime / interval);

export interface CollapsibleLinkProps {
  text: string;
  onClick: () => void;
}

// the link of a collapsible
function CollapsibleLink(props: CollapsibleLinkProps) {
  return (
    <a class="collapsible-block-link" onClick={props.onClick}>{props.text}</a>
  );
}

export class Collapsible extends Component<CollapsibleProps, CollapsibleState> {
  constructor(props: CollapsibleProps) {
    super(props);
    console.log(this.props);

    this.state = {
      show: false,
      contentOpacity: 0
    };
  }

  // slowly make the collapsible more clear
  opacityShader() {
    if (this.state.contentOpacity >= 1) {
      return;
    }

    this.setState((prevState: CollapsibleState): CollapsibleState => {
      return Object.assign({}, prevState, { contentOpacity: prevState.contentOpacity + opacityIncrement });
    }, () => {
      setTimeout(this.opacityShader.bind(this), interval);
    });
  }

  componentDidUpdate(prevProps: CollapsibleProps, prevState: CollapsibleState) {
    if (prevState.show !== this.state.show && this.state.show) {
      setTimeout(this.opacityShader.bind(this), interval);
    }
  }

  setInner(ref: HTMLElement | null) {
    if (ref) {
      ref.innerHTML = "";
      if (this.props.contents.length > 0) {
        for  (const elem of this.props.contents) {
         ref.appendChild(elem);
        }
      }
    }
  }

  changeState() {
    console.log("Changing state");
    this.setState(s => Object.assign({}, s, { show: !s.show, contentOpacity: 0 }));
  }

  render() {
    const blockStyle = {
      opacity: this.state.contentOpacity
    };

    const stateChanger = this.changeState.bind(this);
    const folded = this.state.show ? "unfolded" : "folded";

    const link = <CollapsibleLink text={this.state.show ? this.props.closelink : this.props.openlink}
                                  onClick={stateChanger} />;
    const topHeader = this.props.linkLocation & 1
                        ? link
                        : <span></span>;
    const bottomHeader = this.props.linkLocation & 2 && this.state.show
                         ? link
                         : <span></span>;
     

    return (
      <div class="collapsible-block">
        <div class={`collapsible-block-${folded}`}>
          <div class={`collapsible-block-${folded}-link`}>
            { this.state.show ? link : topHeader }
          </div>
          <div style={blockStyle} class={ this.state.show ? "" : "vanished" } ref={this.setInner.bind(this)}>
            { this.props.children }
          </div>
          <div class={`collapsible-block-${folded}-link`}>
            { this.state.show ? <span></span> : bottomHeader }
          </div>
        </div>
      </div>
    );
  }
}

export default function collapsibleSetup() {
  const collapsibles = $(".ftml--collapsible");

  collapsibles.each(function(this: HTMLElement) {
    const jThis = $(this);
    const openlink = jThis.attr("data-openlink");
    const closelink = jThis.attr("data-closelink");
    const linkLocation = parseInt(jThis.attr("data-link-location"), 10);
    const contents = Array.from(this.children); 

    this.innerHTML = "";

    render(<Collapsible openlink={openlink} closelink={closelink} linkLocation={linkLocation} contents={contents}></Collapsible>, this);
  });
}
