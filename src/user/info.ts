/*
 * user/info.ts
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

// defines the user's information
import { Nullable } from "./../utils";
import { 
  passThruNumber, 
  passThruString, 
  passThruNString, 
	stringToDate,
	UnsafeObject
} from "./../utils/potentially-compromised";

export interface UserInfo {
  userid: number;
  username: string;
  "profile-picture-url": Nullable<string>;

  // extended properties
  "current-role"?: number;
  realname?: Nullable<string>;
  gender?: Nullable<string>;
  website?: Nullable<string>;
  "joined-site"?: string;
  "from"?: Nullable<string>;
  "role-description"?: string;
}

// url regex
const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/; // eslint-disable-line no-useless-escape

// an instantiated version of these structs
export class UserInformation extends UnsafeObject implements UserInfo {
  "profile-picture-url": Nullable<string>

  constructor(
    public userid: number,
    public username: string,
    profilePictureUrl: Nullable<string>
  ) {
    super();
    this["profile-picture-url"] = profilePictureUrl;
  }

  static deserialize(obj: UserInfo): UserInformation {
    const userInfo = new UserInformation(-1,"",null);

    userInfo.sanitizeProperty<number, number>(
      "userid",
      userInfo.userid,
      passThruNumber, 
      (x: number): boolean => x > 0
    );
    userInfo.sanitizeProperty<string, string>(
      "username",
      userInfo.username,
      passThruString, 
      (x: string): boolean => x.length > 0
    );
    userInfo.sanitizeProperty<Nullable<string>, Nullable<string>>(
      "profile-picture-url",
      userInfo["profile-picture-url"],
      passThruNString 
    );

    return userInfo; 
  }
}

export class ExtendedUserInformation extends UserInformation implements UserInfo {
  "current-role": number;
  "joined-site": string;
  "from": string;
  "role-description": string; 

  constructor(
    userid: number,
    username: string,
    profilePictureUrl: string,
    currentRole: number,
    public realname: Nullable<string>,
    public gender: Nullable<string>,
    public website: Nullable<string>,
    public joinedSite: Date,
    placeFrom: Nullable<string>,
    roleDescription: string
  ) {
    super(userid, username, profilePictureUrl);
    this["current-role"] = currentRole;
    this["joined-site"] = joinedSite.toUTCString();
    this["from"] = placeFrom;
    this["role-description"] = roleDescription;
  }

  static deserialize(obj: UserInfo): ExtendedUserInformation {
    const rUserInfo = UserInformation.deserialize(obj);
    const userInfo = new ExtendedUserInformation(rUserInfo.userid,rUserInfo.username,rUserInfo["profile-picture-url"],-1,null,null,null,new Date(0),null,"");

    if (rUserInfo.isCompromised || !rUserInfo["profile-picture-url"]) {
      userInfo.isCompromised = true;
      return userInfo;
    }

    if (!obj["current-role"]) {
      // object is not an extended date
      userInfo.isCompromised = true;
      return userInfo;
    }

    userInfo.sanitizeProperty<number, number>(
      "current-role",
      obj["current-role"],
      passThruNumber, 
      (x: number): boolean => x > 0
    );
    userInfo.sanitizeProperty<Nullable<string>, Nullable<string>>(
      "realname",
      obj["realname"],
      passThruNString 
    );
    userInfo.sanitizeProperty<Nullable<string>, Nullable<string>>(
      "gender",
      obj["gender"],
      passThruNString
    );
    userInfo.sanitizeProperty<Nullable<string>, Nullable<string>>(
      "website",
      obj["website"],
      passThruNString,
    );
    userInfo.sanitizeProperty<string, string>(
      "joined-site",
      obj["joined-site"], 
      passThruString
    );
    userInfo.sanitizeProperty<string, Date>(
      "joinedSite",
      obj["joined-site"],
      stringToDate
    );
    userInfo.sanitizeProperty<Nullable<string>, Nullable<string>>(
      "from",
      obj["from"],
      passThruNString
    );
    userInfo.sanitizeProperty<string, string>(
      "role-description",
      obj["role-description"],
      passThruString
    );
     
    return userInfo;
  }
}
