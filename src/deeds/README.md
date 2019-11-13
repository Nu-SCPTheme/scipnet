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

* `/sys/page/vote` - Rate the page. Expects parameter `rating` of value -1, 0, or 1. Expects result value `rating`, containing the new rating for the page, in return.
* `/sys/page/edit-lock` - Set an edit lock on the page. Expects result value `seconds`, describing how many seconds the user has for the edit lock.
* `/sys/page/edit` - Edits the page. Expects parameters `src`, `title` and `comment.
