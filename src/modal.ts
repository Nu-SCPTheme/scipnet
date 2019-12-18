/*
 * modal.ts
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
// note: if we ever decide to reimplement this in React, this would be a good place to start

import * as $ from "jquery";

import { classMethodToClosure } from "./utils";

function getScrollTop(): number {
  // from https://stackoverflow.com/a/28488360
  return document.documentElement.scrollTop || document.body.scrollTop;
}

export type ModalButtonClick = () => void;

// a button in a modal
export class ModalButton {
  public internalElem: JQuery;

  constructor(
    text: string,
    public click: ModalButtonClick | "close"
  ) {
    if (!(click instanceof String)) {
      this.internalElem = $(`<a class="btn btn-danger">${text}</a>`).click(<ModalButtonClick>click);
    }
  }
}

// manages the modal
export class Modal {
  private shader: JQuery;
  private container: JQuery;
  private window: JQuery; 

  constructor(
    title: string,
    content: JQuery,
    buttons: Array<ModalButton>
  ) {
    this.shader = $("<div class=\"modal-shader\"></div>").appendTo(document.body)
      .click(<any>classMethodToClosure(this, "destroy"));
    this.container = $("<div id=\"modal-container\"></div>").appendTo(document.body);
    
    // put the window in the center of the screen
    const jWindow = $(window);
    const hCenter = jWindow.width() / 2;
    const vCenter = (jWindow.height() / 2) + getScrollTop();

    this.window = $("<div class=\"modal-window\"></div>").appendTo(this.container)
      .css({ "left": `${hCenter}px`, "right": `${vCenter}px` });

    $(`<div class="modal-title">${title}</div>`).appendTo(this.window);
    $("<div class=\"modal-content\"></div>").append(content).appendTo(this.window);
    
    const buttonDiv = $("<div class=\"modal-buttons\"></div>").appendTo(this.window);
    for (const button of buttons) {
      if (button.click instanceof String) {
        button.internalElem.click(<any>classMethodToClosure(this, "destroy"));
      }
      button.internalElem.appendTo(buttonDiv);
    }
  }

  destroy() {
    this.window.remove();
    this.shader.remove();
    this.container.remove();
  }
}
