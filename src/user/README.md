# User information

User information will be sent from the server to the client in the following JSON class:

```
{
  "userid": number,
  "username": string,
  "profile-picture-url": string | null;
  "current-role": number | null; // corresponds to role ID
  
  "realname": string | null;
  "gender": string | null;
  "website": string | null;
  "joined-site": string | null; // ISO8601 date
  "about-me": string | null;
  "from": string | null;
  "role-description": string | null;
}
```

## In-page storage

Although user info can be retrieved via the `/sys/user/info` DEEDS requests, user info can also be stored in the page if it is known that it will be used there. To do this, pass an array of UserInfo objects into the `stored_user_info` jinja2 variable.
