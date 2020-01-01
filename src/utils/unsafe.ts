/*
 * utils/unsafe.ts
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

// potentially compromised object- e.g. bad data may be put into it
import { Nullable } from "./index";

export class UnsafeObject {
  public isCompromised: boolean;
  protected continueIfCompromised: boolean;

  constructor() {
    this.isCompromised = false;
    this.continueIfCompromised = false;
  }

  protected sanitizeProperty<TIn, TOut>(
    propName: string,
    input: TIn,
    converter: (input: TIn) => TOut = x => <TOut>(<any>x),
    constraint: (input: TOut) => boolean = x => true
  ) {
    if (!this.continueIfCompromised && this.isCompromised) {
      return;
    }

    // attempt to get a property
    try {
      const val = converter(input);
      if (!constraint(val)) {
        throw new Error(`Value ${val} does not meet constraints`);
      }

      (<any>this)[propName] = val;
    } catch (err) {
      console.error(`An error occurred during deserialization: ${err}`);
      this.isCompromised = true;
    }
  }
}

// some converters to simplify the class
export const passThruNumber = (x: number): number => x;
export const passThruString = (x: string): string => x;
export const passThruNString = (x: Nullable<string>): Nullable<string> => x === "" ? null : x;
export const stringToDate = (x: string): Date => new Date(x);
