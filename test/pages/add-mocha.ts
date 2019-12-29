/*
 * test/pages/add-mocha.ts
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

// adds mocha support to html documents
import { JSDOM } from "jsdom";
import { Script } from "vm";

import * as jQuery from "jquery";

export default function addMochaSupport(doc: string): string {
  // load DOM without scripts
	const dom = new JSDOM(doc, { runScripts: "outside-only" });
	// @ts-ignore
	dom.window.$ = jQuery(dom.window.document.defaultView);

  // add mocha bits, using jQuery
	const script = new Script(`
		$("<script>mocha.setup('bdd'); console.log('Setup mocha');</script>").prependTo(document.head);
    $("<script>")
      .attr("type", "text/javascript")
      .attr("src", "https://unpkg.com/chai@4.2.0/chai.js")
      .prependTo(document.head); 
    $("<script>")
      .attr("type", "text/javascript")
      .attr("src", "https://unpkg.com/mocha@6.2.2/mocha.js")
      .prependTo(document.head);
    $("<link>")
      .attr("rel", "stylesheet")
      .attr("href", "mocha.css")
      .prependTo(document.head);
    $('<div id="mocha"></div>').appendTo(document.body);
	`);
  dom.runVMScript(script);

  return dom.serialize();
}
