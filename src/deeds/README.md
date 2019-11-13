# Description of the supported Deeds API

Scipnet will send an AJAX request to the specified URL, using either the POST, PUT, or DELETE method. This request will take the form of:

```
{
  "params": {
    "param1": 12,
    "param2": "hello world",
    "param3": null
  },
  "sessionId": "ed04430b-5369-43e2-bacf-dda192e1e921",
  "pagename": "scp-4800"
}
```

Elements within `params` may be either strings, numbers, or null. `sessionId` is a string that uniquely identifies the active session. A UUID is recommended for this purpose, but any string value that is guaranteed to be unique and is generally unpredictable will suffice.

Scipnet expects one of the following in response:

## If there was an error:

```
{
  "errType": "not-logged-in",
  "error": "User is not logged in"
}
```

`errType` will only have an impact on the error relayed to the user if it is one of the following:

* `"not-logged-in"`
* `"internal-error"`
* TODO: add more here if necessary

## If the operation was sucessful:

```
{
  result: { ... }
}
```

## Operations:

* `/sys/page/edit` - Edits the page. Expects parameters `src`, `title` and `comment`, which are the new page source, new title, and edit comment. Expects no result value aside from error.
* `/sys/page/edit-lock` - Set an edit lock on the page. No parameters will be sent aside from sessionId and pagename. Expects result value `edit-lock-seconds`, describing how many seconds the user has for the edit lock.
* `/sys/page/history` - Gets a list of revisions from the page's history. Expects parameters `page`, what page of the history to get, and `revisions-per-page`, the number of revisions to fit in each page. Expects result value `revisions` to consist of JSON objects of the following structure:
```
{
  "rev-id": number;
  "user": string; // should be a username module
  "edited-on": Date;
  "comment": string;
}
```
* `/sys/page/tags` - Sets the tags of the page. Expects parameter `tags`, an array of strings representing tags.
* `/sys/page/vote` - Rate the page. Expects parameter `rating` of value -1, 0, or 1. Expects result value `rating`, containing the new rating for the page, in return.
