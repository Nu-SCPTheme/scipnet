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

// run Mocha tests to determine if the frontend is functioning properly
const { expect } = require("chai");
const fs = require("fs");
const nock = require("nock");
const nunjucks = require("nunjucks");
const querystring = require("querystring");
const sinon = require("sinon");
const uuid = require("uuid/v4");

nunjucks.configure({ autoescape: false });

// set up mock document and such
const { JSDOM } = require("jsdom");
const bundle = fs.readFileSync("dist/bundle.js", { encoding: "utf-8" });

let testHTML = fs.readFileSync("test/testdoc.html", { encoding: "utf-8" });
testHTML = nunjucks.renderString(testHTML, { 
  setPromises: (function() {
    if (process.env.UNDEFINE_PROMISES === "yes") {
      return `window.Promise = undefined;`;
    } else {
      return "";
    }
  })(),
  script: bundle 
});

let document;
let scope;
let window;
let alertFake;
let logFake;

const mockUrl = "http://scp-wiki.net/";

// some variables to keep things consistent between requests
let votes = [];
const sessionId = uuid();

// run before each execution
beforeEach(() => {
  window = (new JSDOM(testHTML, { 
   runScripts: "dangerously",
   url: mockUrl
  })).window;
  document = window.document; 
  document.cookie = `sessionId=${sessionId}`;

  // set up sinon mocks
  window.alert = alertFake = sinon.fake(); // TODO: this won't be necessary once dialog is rebuilt
  console.log = logFake = sinon.fake();

  // set up deeds in nock
  scope = nock(mockUrl)
    .post("/sys/deeds")
    .reply(200, (uri, body) => {
      body = querystring.parse(body);
      if (body.name === "voteOnPage") {
        if (!body.sessionId) return { notLoggedIn: true, result: false, error: "Not logged in" };
        
        console.log(`Calling mock vote function with rating ${body.rating}`);
        const rating = parseInt(body.rating, 10); 

        // add or modify vote
        let found = false;
        for (let i = 0; i < votes.length; i++) {
          if (votes[i].sessionId === body.sessionId) {
            votes[i].vote = rating;
            found = true;
            break;
          }
        }

        if (!found) votes.push({sessionId: body.sessionId, vote: rating});

        // get new vote total
        let total = 0;
        for (const vote of votes) total += vote.vote;

        return { result: true, rating: total };
      } else {
        console.log("An invalid request was made- possibly a DEEDS error");
        return { result: false, error: "Invalid request" };
      }
    });
});

// helper functions
function simulateClick(element) {
  var evt = document.createEvent("HTMLEvents");
  evt.initEvent("click", false, true);
  element.dispatchEvent(evt)
}

describe("Rating module", () => {
  function testVote(buttonClassName, expectVote, expectRating, done) {
    //const rateSpan = document.getElementsByClassName(buttonClassName)[0];
    //rateSpan.firstChild.click();
    window.ratePage(expectVote).then(() => { 
      let alertErr = alertFake.args[0];
      if (alertErr) alertErr = alertErr[0];
      else alertErr = "Unexpected error";
   
      console.log(votes);     

      expect(alertFake).to.have.property("callCount", 0, alertErr);
      expect(votes).to.have.lengthOf(1);
      expect(votes[votes.length - 1]).to.have.property("vote", expectVote);

      // rating should be "1"
      let rating = document.getElementsByClassName("rating")[0];
      expect(rating).to.have.property("innerHTML", expectRating);
      done();
    }, 2000);
  }
 
  it("Upvote", (done) => {
    testVote("rateup", 1, "rating: +1", done);
  }); 

  it("Downvote", (done) => {
    testVote("ratedown", -1, "rating: -1", done);
  });

  it("Novote", (done) => {
    testVote("cancel", 0, "rating: 0", done);
  });
});
