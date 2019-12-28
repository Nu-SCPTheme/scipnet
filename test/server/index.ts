/*
 * test/server/index.ts
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

/*
  Karma and other test runners will work better with a dedicated testing server. This file will export that 
  server.
*/

import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";

import { initializeSql } from "./sql";

import setupRoutes from "./routes";

export default function createTestServer(): express.Application {
  // basic express configuration
  const app = express();
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  setupRoutes(app);

  return app;
}
