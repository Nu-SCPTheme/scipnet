/*
 * test/unit/vote.ts
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

// setup modules for rating
import * as $ from "jquery";
import * as BluebirdPromise from "bluebird";

import { expect } from "chai";

const ratingRecept = $('<span class="rating"></span>').appendTo(document.body);

import { ratePage } from "./../../src/page-utils/rating";

describe("Rating tests", () => {
  function doRatingTest(rate: number) {
    it(`should result in a rating of ${rate}`, async (): BluebirdPromise<void> => {
      await ratePage(rate);
      expect(ratingRecept.text()).to.equal(`rating: ${rate}`);
    });
  }

  doRatingTest(1);
  doRatingTest(0);
  doRatingTest(-1);
});
