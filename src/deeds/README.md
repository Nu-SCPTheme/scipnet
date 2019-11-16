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
  "err-type": "not-logged-in",
  "error": "User is not logged in"
}
```

`err-type` MAY only have an impact on the error relayed to the user if it is one of the following:

* `"not-logged-in"`
* `"internal-error"`
* One of the errors specified below.

## If the operation was sucessful:

```
{
  result: { ... }
}
```

## Operations:

*Note:* For all operations of prefix `/sys/page`, the server MUST expect parameter `pagename` containing a string corresponding to the page's slug, and MUST return error `"page-not-found"` if this slug does not correspond to a page.

### `POST /sys/page/edit-lock`

Set an edit lock on the page. 

**Parameters:**
None

**Result:**
* `edit-lock-seconds: number` - A integer value that MUST be between 0 and 900, that MUST specify the number of seconds the user has the editlock for.

**Errors:**
* `"page-locked"` - The page has been locked by a moderator and cannot be edited without moderator privileges.

### `GET /sys/page/get-rendered-revision`

Gets the rendered version of a source for a revision.

**Parameters:**
* `rev-key: number` - A primary key that MUST correspond to a revision in the database.

**Results:**
* `html: string` - A string containing the HTML render of the revision.

**Errors:**
* `"rev-key-not-found"` - The provided `rev-key` did not correspond to a revision in the database.
 
### `GET /sys/page/get-revision` 

Gets either the source of a particular revision.

**Parameters:**
* `rev-key: number` - A primary key that MUST correspond to a revision in the database.

**Results:**
* `src: string` - MUST contain the source of the page to display to the user.

**Errors:**
* `"rev-key-not-found"` - The provided `rev-key` did not correspond to a revision in the database.

### `GET /sys/page/history` 

Gets a list of revisions from the page's history. 

**Parameters:**

* `page: number` - A number between 0 and the number of pages of revisions the page's history has, that represents which page of the history should be viewed.
* `revisions-per-page: number` - A number that MUST be between 1 and 200 and SHOULD be between 10 and 200. 

**Result:**
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

**Result**::
* `rating-module` - The HTML of a rating module belonging to the current page.

**Errors:**
No special errors.

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

### `POST /sys/page/tags`

Sets the tags of the page.

**Parameters:**
* `tags: string[]` - An array that MUST consist of strings representing tags.

**Result:**
Result MUST be ignored. Result SHOULD be a null value.

**Errors:**
No special errors.

### `POST/DELETE /sys/page/vote`

Rate the page.

**Parameters:**
* `rating: number` - A number which MUST be of value -1, 0, or 1. If the method is `DELETE`, this parameter is not required and is assumed to be zero.

**Result:**
* `score: number` - A number which MUST be the score of the page as evaluated by the scoring algorithm.
