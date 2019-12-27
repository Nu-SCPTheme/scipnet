/*
 * user/user-module.tsx
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

// set up for user modules
import * as $ from "jquery";
import * as BluebirdPromise from "bluebird";

import { getUserInfoById as uiById, getUserInfoByUsername as uiByName } from "./../deeds";
import { h, render } from "preact";
import { Modal, ModalButtonDef } from "./../modal";
import { Nullable } from "./../utils";
import { UserInfo, UserInformation, ExtendedUserInformation } from "./info";

import syncify from "./../utils/syncify";

// the "window" var will have a variable with the necessary JSON in it
const { storedUserInfo } = <any>window;

// load user information by id
export async function getUserInfoById(id: number, extended: boolean): BluebirdPromise<UserInformation> {
  if (!extended) {
    for (const userInfo of storedUserInfo) {
      if (userInfo.userid === id) {
        return UserInformation.deserialize(userInfo);
      } 
    }
  }

  // manually load via ajax
  const userInfo = <UserInfo>(await uiById(extended, id)).result["user-info"];
  if (extended) {
    return ExtendedUserInformation.deserialize(userInfo);
  }
  return UserInformation.deserialize(userInfo);
}

// load user information by username
export async function getUserInfoByUsername(name: string, extended: boolean): BluebirdPromise<UserInformation> {
  if (!extended) {
    for (const userInfo of storedUserInfo) {
      if (userInfo.username === name) {
        return UserInformation.deserialize(userInfo);
      } 
    }
  }

  // manually load via ajax
  const userInfo = <UserInfo>(await uiByName(extended, name)).result["user-info"];
  if (extended) {
    return ExtendedUserInformation.deserialize(userInfo);
  }
  return UserInformation.deserialize(userInfo);
}

let avatarHoverBlock: JQuery;

// setup triggers on a user module
// TODO: a lot of this could be converted to React, but I'm not sure how...
export function setupUserTrigger() {
  $(".printuser:not(.trigger-setup)")
    .hover(function(this: HTMLElement) {
      const jThis = $(this);
      if (!jThis.hasClass("avatar-hover")) {
        return;
      }

      // create a hover container is there isn't one
      if (!avatarHoverBlock) {
        avatarHoverBlock = $("<div id=\"avatar-hover-container\"></div>").appendTo(document.body);
      }

      // create a hover element for this one
      const userid = jThis.attr("id");
      const hoverBlock = $(`#avatar-hover-container #avatar-${userid}`);

      // if the hoverblock does not exist, make a function that makes it exist
      let promise;
      if (!hoverBlock.length) {
        promise = (async (id: number): BluebirdPromise<JQuery> => {
          const userInfo = await getUserInfoById(id, false);
          if (userInfo.isCompromised) {
            throw new Error("UserInfo is compromised");
          }

          const pfpUrl = userInfo["profile-picture-url"];
          const username = userInfo.username;

          return $(`<a href="/sys/user-info/${username}" id="avatar-${id}" class="avatar-hover vanished" style="position: absolute; display: none;">
               <div>
                 <img src="${pfpUrl}" alt="" />
               </div>
             </a>`).appendTo(avatarHoverBlock);
        })(parseInt(userid, 10));
      } else {
        promise = BluebirdPromise.resolve<JQuery>(hoverBlock);
      }

      // spawn the hoverer
      promise.then((hoverer: JQuery) => {
        hoverer.removeClass("vanished")
          // you can pass an object into the CSS function
          .css(((item: JQuery): { [key: string]: string} => { 
            const pos = jThis.find("img").position();
            return {
              left: `${pos.left}px`,
              top: `${pos.top}px`
            };
          })(jThis));
      }).catch((err: Error) => { }); // just absorb any errors
    }, function(this: HTMLElement) {
      const jThis = $(this);
      if (!jThis.hasClass("avatar-hover")) {
        return;
      } 

      $(`#avatar-hover-container #avatar-${jThis.attr("id")}`).addClass("vanished");
    }).click(function(this: HTMLElement) {
      getUserInfoById(parseInt($(this).attr("id"), 10), true).then((userInfo: UserInformation) => {
        const user = <ExtendedUserInformation> userInfo;

        // generate a modal
        const pfpImgStyle = {
          float: "left",
          padding: "2px 8px", 
          "background-color": "#FFF";
        };

        // minor component to render a table's row
        function UTableRow(props: { name: string, value: string | null }) {
          if (props.value) {
            return (
              <tr><td><b>{name}</b></td><td>${value}</td></tr>
            );
          } else {
            return (<span></span>);
          }
        }

        // render the modal
        render((
          <Modal title="User info" buttons={ [ { text: "Close window", click: "close" } ] }>
            <div>
              <img src={`${user["profile-picture-url"}`} alt="" style={pfpImgStyle}></img>
              <h1>{user.username}</h1>
              <table>
                <UTableRow name="Real name" value={user.realname} />
                <UTableRow name="Gender" value={user.gender} />
                <UTableRow name="From" value={user["from"]} />
                <UTableRow name="Website" value={user.website} />
                {
                  (() => {
                    if (user["joined-site"]) {
                      return <UTableRow name="User since:" value={user.joinedSite.toUTCString()} />
                    } else {
                      return <span></span>
                    }
                  })()
                }
                <UTableRow name="Role on this site:" value={user["role-description"]} />
              </table>
            </div>
          </Modal>
        ), document.body);
      });
    }).addClass(".trigger-setup");
}
