/*
 * test.js
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

const Cookies = require("js-cookie");
const DOMParser = require("dom-parser");
const fs = require("fs");
const nock = require("nock");

const domParser = new DOMParser();

let curRatings = [];
function sumRating() {
  let rating = 0;
  for (const curRating of curRatings) {
    rating += curRating.rating;
  }
  return rating;
}

const scope = nock("https://localhost").post("/sys/deeds").reply(200, (uri, body) => {
  if (body.name === "voteOnPage") {
    // emulate voting functionality
    if (!body.sessionId) {
      return { notLoggedIn: true, result: false };
    }

    if (body.rating > 1 || body.rating < -1) {
      return { result: false, error: "Invalid rating value" };
    } 

    let found = false;
    for (let i = 0; i < curRatings.length; i++) {
      if (curRatings.sessionId === body.sessionId) {
        curRatings[i].rating = body.rating;
        found = true;
        break;
      }
    }

    if (!found) {
      curRatings.push({ sessionId: body.sessionId, rating: body.rating });
    }

    return { result: true, rating: sumRating() };
  }
}).persist();

describe("Testing page utilities", function() {
  /*before(function() {
    let source = fs.readFileSync("test/testdoc.html");
    document = domParser.parseFromString(source);
    require("../dist/bundle.js");
  });

  describe("Rating module", function() {
    it("Upvote", function() {
      Cookies.set("sessionId", 1);
      document.getElementsByClassName("upvote-button")[0].click();
    }); 
  });*/
});
