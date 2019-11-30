/*
 * flags.ts
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

export enum Flag {
  NewPage = "N",
  SourceChanged = "S",
  TitleChanged = "T",
  TagsChanged = "A",
  Rename = "R"
}

// convert a string representation of a flag to a flag
export function flagFromString(s: string): Flag {
  switch (s) {
  case "N": return Flag.NewPage;
  case "S": return Flag.SourceChanged;
  case "T": return Flag.TitleChanged;
  case "A": return Flag.TagsChanged;
  case "R": return Flag.Rename;
  default: throw new Error(`Invalid flag: ${s}`);
  }
}

export const Flags = [Flag.NewPage, Flag.SourceChanged, Flag.TitleChanged, Flag.TagsChanged, Flag.Rename];
