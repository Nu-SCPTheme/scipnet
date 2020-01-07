# Description of the supported Deeds API

(Note: this is provisional and should not be considered absolutely necessary until we have a solid diagram for our architecture)

Scipnet MUST send an AJAX request to the specified URL, using either the GET, POST, PUT, or DELETE methods. This request will take the form of:

```
{
  "params": {
    "foo": 12,
    "bar": "hello world",
    "xop": null
  },
  "pagename": "scp-4800"
}
```

Elements within `params` SHOULD be either strings, numbers, or null.
 
Scipnet MUST recieve of the following in response:

## If there was an error:

```
{
  "error": "not-logged-in",
  "message": "User is not logged in"
}
```

`error` MAY only have an impact on the error relayed to the user if it is one of the following:

* `"not-logged-in"`
* `"internal-error"`
* `"page-locked"`
* One of the errors specified below.

## If the operation was successful:

```
{
  result: { ... }
}
```

## Operations:

### `POST /sys/auth/confirm-register`

Confirm a registration via a code sent by email.

**Parameters:**
* `code: string` - MUST be the code sent to the user via email.
* `email: string` - MUST be the email that the code was sent to.

**Results:**
None

**Errors:**
* `invalid-code` - The code used was not valid.

### `POST /sys/auth/confirm-reset-password`

Confirm a request to reset the password via a code sent by email.

**Parameters:**
* `code: string` - MUST be the code sent to the user via email.
* `email: string` - MUST be the email that the code was sent to.

**Results:**
None

**Errors:**
* `invalid-code` - The code used was not valid.

### `POST /sys/auth/login`

Logs in with the specified credentials and creates a session.

**Parameters:**
* `username: string` - MUST be either the username or the email of the user logging in.
* `password: string` - MUST be the password of the user logging in.

**Results:**
* `auth-session: string` - A unique token that represents the user's session.
* `cookie-preserve-time: number` - The length in seconds to preserve the cookie for.

**Errors:**
* `credential-mismatch` - The credentials did not match any found in the server.

### `POST /sys/auth/register`

Register a new user in the system.

**Parameters:**
* `username: string` - MUST be a unique username.
* `email: string` - MUST be a valid email address accessible to the user.
* `password: string` - MUST be the password of the user logging in.

**Results:**
None

**Errors:**
* `username-already-exists` or `email-already-exists` - Either the user or the email already exist in the system.

**Parameters:**
* `username: string` - MUST be a unique username.
* `email: string` - MUST be a valid email address accessible to the user.
* `password: string` - MUST be the password of the user logging in.

**Results:**
None

**Errors:**
* `username-already-exists` or `email-already-exists` - Either the user or the email already exist in the system.

### `POST /sys/auth/reset-password`

Begin the request to reset the password.

**Parameters:**
* `email: string`- MUST be the user's email registered to their account.

**Results:**
None

**Errors:**
* `email-not-found` - The email was not found in the database.

### `PUT /sys/auth/reset-password`

Reset the user's password.

**Parameters:**
* `email: string` - MUST be email of the user whose password is to be reset.
* `new-password: string` - MUST be the new password of the user. MUST not be identical to their current one.

**Results:**
None

**Errors:**
* `email-not-found` - The email was not found in the database.
* `unauthorized` - The request was not proceeded by an earlier `POST /sys/auth/confirm-reset-password` request.
* `passwords-identical` - The passwords chosen are identical.

*Note:* For all operations of prefix `/sys/page`, the server MUST expect parameter `pagename` containing a string corresponding to the page's slug, and MUST return error `"page-not-found"` if this slug does not correspond to a page.

### `POST /sys/page/cancel-edit-lock`

Cancels the edit lock the user has on the page.

**Parameters:**
None

**Result:**
None

**Errors:**
None outside of standard errors.

### `POST /sys/page/edit-lock`

Set an edit lock on the page. 

**Parameters:**
None

**Result:**
* `edit-lock-seconds: number` - A integer value that MUST be between 0 and 900, that MUST specify the number of seconds the user has the editlock for.

**Errors:**
None outside of standard errors.

### `GET /sys/page/history` 

Gets a list of revisions from the page's history. 

**Parameters:**

* `page: number` - A number between 0 and the number of pages of revisions the page's history has, that represents which page of the history should be viewed.
* `revisions-per-page: number` - A number that MUST be between 1 and 200 and SHOULD be between 10 and 200. 

**Result:**
* `total-pages: number` - The number of total pages that would be existant using the current `revisions-per-page` parameter.
* `revisions: object[]` - An array that MUST consist of JSON objects of the following structure:
```
{
  "rev-key": number; // will be the primary key of the revision
  "rev-id": number;
  "flag": string;
  "user": string; // will be a username module
  "edited-on": string; // will be an ISO 8601 string
  "comment": string;
}
```

**Errors:**
* `"no-results-found"` - The selected parameters did not result in any revisions.

### `GET /sys/page/parent`

Gets the parent(s) of the page.

**Parameters:**
None

**Result:**
* `parents: string[]` - An array that contains strings corresponding to the slugs of the parent pages.

**Errors:**
No special errors.

### `POST /sys/page/parent` 

Sets the parent(s) of the page.

**Parameters:**
* `parents: string[]` - An array that MUST contain strings that MUST correspond to the slugs of the new parent pages.

**Result:**
Result MUST be ignored. Result SHOULD be a null value.

**Errors:**
* `"invalid-slug"` - One or more of the slugs did not refer to a valid page.

### `GET /sys/page/rating-module`

Gets the HTML for the page's rating module.

**Paramters:**
None

**Result**:
* `rating-module` - The HTML of a rating module belonging to the current page.

**Errors:**
No special errors.

### `GET /sys/page/rendered-revision`

Gets the rendered version of a source for a revision.

**Parameters:**
* `rev-key: number` - A primary key that MUST correspond to a revision in the database.

**Results:**
* `html: string` - A string containing the HTML render of the revision.

**Errors:**
* `"rev-key-not-found"` - The provided `rev-key` did not correspond to a revision in the database.

### `POST /sys/page/rename`

Renames the page. 

**Parameters:**
* `new-slug: string` - MUST be a string to change the target page's slug to. This slug MUST be unique.

**Result:**
Result MUST be ignored. Result SHOULD be a null value.

**Errors:**
* `"page-already-exists"` - A page already exists with a given slug.

### `POST /sys/page/revert-revision`

Reverts to a past revision. 

**Parameters:**
* `rev-key: number` - A primary key that MUST correspond to a revision in the database. 

**Result:**
Result MUST be ignored. Result SHOULD be a null value.

**Errors:**
* `"rev-key-not-found"` - The provided `rev-key` did not correspond to a revision in the database.

### `GET /sys/page/revision` 

Gets either the source of a particular revision.

**Parameters:**
* `rev-key: number` - A primary key that MUST correspond to a revision in the database.

**Results:**
* `src: string` - MUST contain the source of the page to display to the user.

**Errors:**
* `"rev-key-not-found"` - The provided `rev-key` did not correspond to a revision in the database.

### `GET /sys/page/source`

Gets the source of the page. 

**Parameters:**
None

**Result:**
* `src: string` - MUST be a string containing the Markdown describing the page.

**Errors:**
No special errors.

### `POST /sys/page/source` 

Edits the page.

**Parameters:** 
* `src: string` - The new page source to append. 
* `title: string` - The new title for the page.
* `comment: string` - The commit message for the edit.

**Result:**
Result MUST be ignored. Result SHOULD be a null value.

**Errors:**
* `"page-locked"` - The page has been locked by a moderator and cannot be edited without moderator privileges.

### `GET/POST /sys/page/tags`

Sets the tags of the page.

**Parameters:**
* `tags: string[]` - (Exclusive to `POST`) An array that MUST consist of strings representing tags.

**Result:**
* `tags: string[]` - (Exclusive to `GET`) An array containing strings representing the page's tags.

**Errors:**
No special errors.

### `POST/DELETE /sys/page/vote`

Rate the page.

**Parameters:**
* `rating: number` - A number which MUST be of value -1, 0, or 1. If the method is `DELETE`, this parameter is not required and is assumed to be zero.

**Result:**
* `score: number` - A number which MUST be the score of the page as evaluated by the 



### `POST /sys/user/info`

Sets new information for a user.

**Parameters:**
* `user-info: [UserInfo](https://github.com/Nu-SCPTheme/scipnet/blob/master/src/user/README.md)` - Object containing changes in the user's information. Also contains the user id used to select the user.

**Results:**
None

**Errors:**
* `user-not-found` - The user ID did not correspond to a user in the database.
TODO: more errors

### `GET /sys/user/info/by-id`

Gets a user's info by its ID.

**Parameters:**
* `extended: boolean` - Whether or not the user info should include fields that are not required to display the user module.
* `userid: number` - MUST be the ID of the user in the database

**Results:**
* `user-info: [UserInfo](https://github.com/Nu-SCPTheme/scipnet/blob/master/src/user/README.md)` - Information regarding the selected user.

**Errors:**
* `user-not-found` - The user ID did not correspond to a user in the database.

### `GET /sys/user/info/by-username`

Gets a user's info by its username.

**Parameters:**
* `extended: boolean` - Whether or not the user info should include fields that are not required to display the user module.
* `username: string` - MUST be the username of the user in the database

**Results:**
* `user-info: [UserInfo](https://github.com/Nu-SCPTheme/scipnet/blob/master/src/user/README.md)` - Information regarding the selected user.

**Errors:**
* `user-not-found` - The username did not correspond to a user in the database.
