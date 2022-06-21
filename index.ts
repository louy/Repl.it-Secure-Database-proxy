import { createServer, request, IncomingMessage, ServerResponse } from 'http';
import { request as requestHttps } from 'https';
import { parse } from 'url';

createServer(handler).listen(80);

const DB_URL = parse(process.env.REPLIT_DB_URL!);

if (DB_URL.protocol !== 'http:' && DB_URL.protocol !== 'https:') {
  throw new Error('Unknown DB URL protocol: ' + DB_URL.protocol);
}

const EXPECTED_API_KEY = process.env.API_KEY!
if (!EXPECTED_API_KEY) {
  throw new Error('Missing API key. Please set API_KEY in environment.')
}
if (!EXPECTED_API_KEY.match(/^[A-Z0-9\-\_]{6,20}$/)) {
  throw new Error('Invalid API key. It must be between 6 and 20 characters long, and can only contain letters, numbers, or one of the following: _-')
}

function handler(client_req: IncomingMessage, client_res: ServerResponse) {
  console.log('serve: ' + client_req.method + ' ' + client_req.url);

  if (!client_req.url!.startsWith(EXPECTED_API_KEY + '/')) {
    client_res.writeHead(401)
    client_res.write('Invalid api key\n')
    client_res.end();
    return;
  }

  const url = client_req.url!.substring(EXPECTED_API_KEY.length+1);

  var options = {
    hostname: DB_URL.host,
    port: DB_URL.port,
    path: DB_URL.pathname + url.replace(/\.+/g, '.'),
    method: client_req.method,
    headers: {
      'Content-Type': client_req.headers['content-type'],
    },
  };

  const reqFn = DB_URL.protocol === 'https:' ? requestHttps : request;

  var proxy = reqFn(options, function (res) {
    client_res.writeHead(res.statusCode!, res.headers)
    res.pipe(client_res, {
      end: true
    });
  });

  client_req.pipe(proxy, {
    end: true
  });
}
