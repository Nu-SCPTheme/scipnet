/*
 * test/test.ts
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

import { JSDOM, ResourceLoader, VirtualConsole } from "jsdom";
import { promisify } from "util";
import { Script } from "vm";

import * as $ from "jquery";
import * as fs from "fs";
import * as http from "http";
import * as path from "path";

// generator for pages
import { generatePage, PageType } from "./pages/generate-pages";

// api testing server
import createTestServer from "./server/dist";

// promises
const readFile = promisify(fs.readFile);

// async sleep
const timeout = (ms: number) => new Promise((resolve: () => void) => setTimeout(resolve, ms));

// cache script files so we don't have to load them from the internet from the CI
type ImportedFiles = { [url: string]: Buffer };
const importedFiles: ImportedFiles = {};

async function importResource(namever: string, pathFromPkgRoot: string) {
  const resourcePath = path.join(__dirname, "..", "node_modules", namever.split("@")[0], pathFromPkgRoot)
  const file: Buffer = await readFile(resourcePath);
  importedFiles[`https://unpkg.com/${namever}/${pathFromPkgRoot}`] = file;
}

// class for resource loading
class ScipnetResourceLoader extends ResourceLoader {
  async fetch(url: string, options: any): Promise<Buffer> {
    // if the file is a cached module, load it here
    if (importedFiles.hasOwnProperty(url)) {
      return importedFiles[url];
    }

		// if we need the mocha css, load it
		if (/mocha\.css$/.test(url)) {
      return await readFile(path.join(__dirname, "..", "node_modules", "mocha", "mocha.css"));
	  }

    // do the normal fetch function, but warn if it's an outside url
    if (!(/\/sys\//.test(url))) {
      console.log(`Attempting to access outside url: ${url}`);
    }

    return await super.fetch(url, options);
  }
}

// get the resource loader
let resourceLoader: ScipnetResourceLoader;
async function getResourceLoader(): Promise<ScipnetResourceLoader> {
  if (!resourceLoader) {
    const resources: { [key: string]: string } = {
      "core-js-bundle@3.6.1": "minified.js",
      "bluebird@3.7.2": "js/browser/bluebird.min.js",
      "jquery@3.4.1": "dist/jquery.min.js",
      "preact@10.1.1": "dist/preact.umd.js", 

      "chai@4.2.0": "chai.js",
      "mocha@6.2.2": "mocha.js"
    };
    
    let promises = [];
    for (const resource of Object.keys(resources)) {
      promises.push(importResource(resource, resources[resource]));
    }
    await Promise.all(promises);

    resourceLoader = new ScipnetResourceLoader();
  }
  return resourceLoader;
}

const port = 4910;

// script to run tests, inside of the browser
const vmScript = new Script(`
  mocha.run();
`);

// set up the test environment
function runTests(pageType: PageType) {
  let app, server: http.Server, dom: JSDOM;

  describe(`Page test: ${pageType}`, () => { 
    before(async () => {
      // start up the test server
      app = createTestServer();
      server = http.createServer(app);
      server.listen(port);
  
      // give some time for the server to init
      await timeout(3000);

      // TODO: generate a user module
      const userModule = "";

      const virtualConsole = new VirtualConsole();
      virtualConsole.sendTo(console);
      dom = new JSDOM(await generatePage(pageType, userModule), {
        url: `http://localhost:${port}/${pageType === PageType.TypicalPage ? "" : pageType}`,
        runScripts: "dangerously",
        resources: await getResourceLoader(),
        virtualConsole
      });

			// do not start until we get confirmation that mocha is set up
			await new Promise((resolve: () => void) => {
        virtualConsole.on("log", (res: string) => {
					if (/^Setup mocha/.test(res)) {
            resolve();
				  }
			  });
		  });
    }); 

    it("should run some tests", () => {
      dom.runVMScript(vmScript);
    });

    // TODO: use promise events to wait for it to end
    after(() => {
      server.close();
    }); 
  });
}


runTests(PageType.TypicalPage);
