# Repl.it Secure Database Proxy

A proxy to the Repl.it database service that allows a single database to be used with multiple repls.

To use this, add an environment variable called `API_KEY`. This should be alphanumeric with a length of 6-20 characters (it's gonna be passed in the URL).

Next, from where you want to access the database, use the proxy repl url + api key as the key for replit database client. For example, if using the javascript client:

```js
const Client = require("@replit/database");

const client = new Client('https://Replit-Secure-Database-proxy.louy.repl.co/' + MY_SECRET_KEY);
//                        ^-- this is what you need to configure

await client.set("key", "value");
let key = await client.get("key");
console.log(key);
```
