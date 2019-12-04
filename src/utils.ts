/*
 * utils.ts
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

import * as BluebirdPromise from "bluebird";

export type Nullable<T> = T | null;

// async version of setTimeout
export async function timeout(ms: number): BluebirdPromise<void> {
  return new BluebirdPromise((resolve: () => void) => {
    setTimeout(resolve, ms);
  }); 
}

// potentially compromised object- e.g. bad data may be put into it
export class PotentiallyCompromised {
  public isCompromised: boolean;
  protected continueIfCompromised: boolean;

  constructor() {
    this.isCompromised = false;
    this.continueIfCompromised = false;
  }

  protected deserializeProperty<TIn, TOut>(
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
      if (!val || !constraint(val)) {
        throw new Error(`Value ${val} does not meet constraints`);
      }

      (<any>this)[propName] = val;
    } catch (err) {
      console.error(`An error occurred during deserialization: ${err}`);
      this.isCompromised = true;
    }
  } 
}

// make a closure out of a class method
export function classMethodToClosure(obj: any, methodName: string): Function {
  return (function(instance: any): Function {
    const func = obj.prototype[methodName];
    return function(): any { 
      return func.apply(obj, arguments);
    };
  })(obj);
}
