var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var import_http = __toModule(require("http"));
var import_https = __toModule(require("https"));
var import_url = __toModule(require("url"));
(0, import_http.createServer)(handler).listen(80);
const DB_URL = (0, import_url.parse)(process.env.REPLIT_DB_URL);
if (DB_URL.protocol !== "http:" && DB_URL.protocol !== "https:") {
  throw new Error("Unknown DB URL protocol: " + DB_URL.protocol);
}
function handler(client_req, client_res) {
  console.log("serve: " + client_req.url);
  console.log(client_req.headers);
  var options = {
    hostname: DB_URL.host,
    port: DB_URL.port,
    path: DB_URL.pathname + client_req.url.replace(/\.+/g, "."),
    method: client_req.method
  };
  const reqFn = DB_URL.protocol === "https:" ? import_https.request : import_http.request;
  var proxy = reqFn(options, function(res) {
    client_res.writeHead(res.statusCode, res.headers);
    res.pipe(client_res, {
      end: true
    });
  });
  client_req.pipe(proxy, {
    end: true
  });
}
//# sourceMappingURL=index.js.map
