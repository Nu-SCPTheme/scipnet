/*
 * collapsible.ts
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

// code to make collapsibles work
import * as $ from "jquery";

import opacityScale from "./../opacity";

// TODO: the JQuery here could probably be made more efficient

interface CollapsibleBlock {
  foldedBlock: JQuery;
  unfoldedBlock: JQuery;
  uncollapseLink: JQuery;
  collapseLink: JQuery;
  content: JQuery;
}

function cbFromRoot(root: JQuery): CollapsibleBlock {
  const foldedBlock = root.find(".collapsible-block-folded").first();
  const unfoldedBlock = root.find(".collapsible-block-unfolded").first();
  const uncollapseLink = foldedBlock.find(".collapsible-block-link").first();
  const collapseLink = unfoldedBlock.find(".collapsible-block-link").first();
  const content = unfoldedBlock.find(".collapsible-content").first();
  return {
    foldedBlock,
    unfoldedBlock,
    uncollapseLink,
    collapseLink,
    content
  };
}

function collapse(link: JQuery) {
  // the collapsible block root should be 3 elements above
  const collapsibleBlock = cbFromRoot(link.parent().parent().parent());  
  collapsibleBlock.foldedBlock.removeClass("vanished");
  collapsibleBlock.unfoldedBlock.addClass("vanished");
  collapsibleBlock.content.addClass("vanished");
}

async function uncollapse(link: JQuery): Promise<void> {
  // root should be 2 elements above
  const collapsibleBlock = cbFromRoot(link.parent().parent());
  collapsibleBlock.foldedBlock.addClass("vanished");
  collapsibleBlock.unfoldedBlock.removeClass("vanished");
  collapsibleBlock.content.removeClass("vanished");
  await opacityScale(collapsibleBlock.content, 500);
}

export default function collapsibleSetup() {
  const collapsibles = $(".collapsible-block");

  collapsibles
    .find(".collapsible-block-folded")
    .find(".collapsible-block-link")
    .click(function(this: HTMLElement) {
      uncollapse($(this)).then(() => {}).catch((err: Error) => { throw err; });
    });

  collapsibles
    .find(".collapsible-block-unfolded-link")
    .find(".collapsible-block-link")
    .click(function(this: HTMLElement) {
      collapse($(this));
    });
}
