/*
 * modal.tsx
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

// creates and maintains a modal element

import * as $ from "jquery";
import { h, Component, VNode } from "preact";

function getScrollTop(): number {
  // from https://stackoverflow.com/a/28488360
  return document.documentElement.scrollTop || document.body.scrollTop;
}

export type ModalButtonClick = () => void;

// closable - temp interface used to keep sequencing together
interface Closable {
  destroy: () => void;
}

interface ModalButtonProps {
  text: string;
  click: ModalButtonClick | "close";
  parentModal: Closable;
}

function ModalButton(props: ModalButtonProps) {
  const ocMethod = props.click === "close" 
    ? props.parentModal.prototype.destroy.bind(props.parentModal) 
    : <ModalButtonClick>props.click;

  return (
    <a class="btn btn-danger" onClick={ocMethod}>
      {this.props.text}
    </a>
  );
}

// interface to define a modal button without using JSX
export interface ModalButtonDef {
  text: string;
  click: ModalButtonClick | "close";
}

export interface ModalProps {
  title: string;
  buttons: Array<ModalButtonDef>
}

// store the window in a jquery constant to reduce execution time
const jWindow = $(window);

// manages the modal
export class Modal extends Component<ModalProps, {}> implements Closable {
  innerRef: JQuery;

  constructor(props: ModalProps) {
    super(props);
  }

  render() {
    const hCenter = jWindow.width() / 2;
    const vCenter = (jWindow.height() / 2) + getScrollTop();

    const windowStyle = {
      left: `${hCenter}px`,
      top: `${vCenter}px`
    };

    return (
      <span ref={(r: HTMLElement | null) => this.innerRef = r}>
        <div class="modal-shader"></div>
        <div id="modal-container">
          <div id="modal-window" style={windowStyle}>
            <div class="modal-title">{this.props.title}</div>
            <div class="modal-content">{this.props.children}</div>
            <div class="modal-buttons">
              {
                this.props.buttons.map((mbd: ModalButtonDef) => {
                  return (
                    <ModalButton text={mbd.text} click={mbd.click} parentModal={this} />
                  );
                });
              }
            </div>
          </div>
        </div>
      </span>
    );
  }

  destroy() {
    $(this.innerRef).remove();
  }
}
