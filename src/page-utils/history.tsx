/*
 * page-utils/history.tsx
 *
 * scipnet - Frontend scripts for mekhane
 * Copyright (C) 2019-2020 not_a_seagull
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

import * as BluebirdPromise from "bluebird";
import * as $ from "jquery";

import { h, render } from "preact";
import { HistoryWidget } from "./../history";

import closeUtilities from "./hide-all";

const hBlock = $("#utility-history-block");

export async function openHistoryBlock(): BluebirdPromise<void> {
  closeUtilities();
  render(<HistoryWidget />, hBlock.get(0));
  hBlock.removeClass("vanished");
}
