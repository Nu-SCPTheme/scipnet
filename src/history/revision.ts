/*
 * revision.ts
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

// defines a revision object
// for more information, see https://github.com/Nu-SCPTheme/scipnet/blob/master/src/deeds/README.md#get-syspagehistory

import * as BluebirdPromise from "bluebird";

import { flagFromString, Flag, Flags } from "./flags";
import { PotentiallyCompromised } from "./../utils";

import getRenderedRevision from "./../deeds/rendered-revision";
import getRevision from "./../deeds/revision";
import revertRevision from "./../deeds/revert-revision";

export class Revision extends PotentiallyCompromised {
  constructor(
    public revKey: number, // primary key to revision object in database
    public revId: number, // the number of the revision (e.g. 2 for the 2nd revision after the original)
    public flag: Flag,
    public user: string, // username module in HTML defining the user
    public editedOn: Date,
    public comment: string
  ) { 
    super();
    this.continueIfCompromised = false;
  }

  // deserialize this object from another one
  static deserialize(obj: any): Revision {
    const rev = new Revision(-1,-1,Flag.SourceChanged,"",new Date(),"");

    rev.deserializeProperty<number, number>(
      "revKey", 
      obj["rev-key"] || obj.revKey, 
      (x: number): number => x, 
      (x: number): boolean => x > 0
    );
    rev.deserializeProperty<number, number>(
      "revId", 
      obj["rev-id"] === undefined ? obj.revId : obj["rev-id"],
      (x: number): number => x,
      (x: number): boolean => (x >= 0)
    );
    rev.deserializeProperty<string, Flag>(
      "flag", 
      obj.flag, 
      flagFromString, 
      (x: Flag): boolean => Flags.indexOf(x) !== -1
    );
    rev.deserializeProperty<string, Date>(
      "editedOn", 
      obj["edited-on"] || obj.editedOn,
      (x: string): Date => new Date(x)
    );
    rev.deserializeProperty<string, string>("comment", obj.comment);

    return rev;
  }
 
  // get the source of a revision
  async getSource(): BluebirdPromise<string> {
    if (this.isCompromised) return "";

    const res = await getRevision(this.revKey);
    return <string> (res.result || {}).src || "";
  }

  // get the rendered source of the revision
  async getRendered(): BluebirdPromise<string> {
    if (this.isCompromised) return "";
    
    const res = await getRenderedRevision(this.revKey);
    return <string> (res.result || {}).src || "";
  }

  // revert to this revision
  async revert(): BluebirdPromise<void> {
    if (this.isCompromised) return;

    await revertRevision(this.revKey);
  }
}
