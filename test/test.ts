/*
 * test.ts
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
import { assert, expect } from "chai";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as fs from "fs";
import * as http from "http";
import * as nunjucks from "nunjucks";
import * as querystring from "querystring";
import * as sinon from "sinon";
import * as uuid from "uuid/v4";

nunjucks.configure({ autoescape: false });

// set up mock document and such
import { JSDOM } from "jsdom";
const bundle = fs.readFileSync("dist/bundle.js", { encoding: "utf-8" });

let testHTML = fs.readFileSync("test/page.html", { encoding: "utf-8" });
testHTML = nunjucks.renderString(testHTML, { 
  setPromises: (() => {
    if (process.env.UNDEFINE_PROMISES === "yes") {
      return `window.Promise = undefined;`;
    } else {
      return "";
    }
  })(),
  script: bundle 
});

let document: HTMLDocument;
let window: Window;
let alertFake: sinon.SinonSpy;
let logFake: sinon.SinonSpy;

const port = 4848;
const mockUrl = `http:///localhost:${port}`;

// some variables to keep things consistent between requests
let votes: Array<any> = [];
const sessionId = uuid();

// run a quick express server
const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/sys/page/vote", async function(req: express.Request, res: express.Response) {
  const body = req.body;
  console.log(body);

  if (!req.cookies["sessionId"]) {
    res.json({ errType: "not-logged-in", error: "User is not logged in" });
    return;
  }
       
  console.log(`Calling mock vote function with rating ${body.params.rating}`);
  const rating = parseInt(body.params.rating, 10); 

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
  for (const vote of votes) {
    total += vote.vote;
  }

  res.json({ result: { rating: total } }); 
});

let server = http.createServer(app);

// run before each execution
before(() => {
  window = (new JSDOM(testHTML, { 
   runScripts: "dangerously",
   url: mockUrl
  })).window;
  document = window.document; 
  document.cookie = `sessionId=${sessionId}`;

  // set up sinon mocks
  window.alert = alertFake = sinon.fake(); // TODO: this won't be necessary once dialog is rebuilt
  console.log = logFake = sinon.fake(); 
});

before((done: () => void) => {
  server.listen(port, done);
});

after((done: () => void) => {
  server.close(done);
});

// helper functions
function simulateClick(element: Element) {
  var evt = document.createEvent("HTMLEvents");
  evt.initEvent("click", false, true);
  element.dispatchEvent(evt)
}

describe("Rating module", () => {
  function testVote(buttonClassName: string, expectVote: number, expectRating: string, done: () => void) {
    //const rateSpan = document.getElementsByClassName(buttonClassName)[0];
    //rateSpan.firstChild.click();
    (<any>window).ratePage(expectVote).then(() => { 
      let alertErr: any = alertFake.args[0];
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
 
  it("Upvote", (done: () => void) => {
    testVote("rateup", 1, "rating: +1", done);
  }); 

  it("Downvote", (done: () => void) => {
    testVote("ratedown", -1, "rating: -1", done);
  });

  it("Novote", (done: () => void) => {
    testVote("cancel", 0, "rating: 0", done);
  });
});

describe("Collapsibles", () => {
  it("Open Collapsible", () => {
    const uncollapseLink = document.getElementsByClassName("collapsible-block-link")[0]; 
    simulateClick(uncollapseLink);
  });

  it("Close Collapsible", () => {
    const collapseLink = document.getElementsByClassName("collapsible-block-link")[1]; 
    simulateClick(collapseLink);   
  }); 
});

describe("Tabviews", () => {
  it("Open Tab #2", () => {
    const tabLink2 = document.getElementsByClassName("tab-selector")[1];
    simulateClick(tabLink2);
  });
  
  it("Open Tab #1", () => {
    const tabLink1 = document.getElementsByClassName("tab-selector")[0];
    simulateClick(tabLink1);
  });
});
