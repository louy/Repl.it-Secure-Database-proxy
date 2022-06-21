import {createServer, request} from 'http';
import {request as requestHttps} from 'https';
import {parse} from 'url';

createServer(handler).listen(80);

const DB_URL = parse(process.env.REPLIT_DB_URL!);

if (DB_URL.protocol !== 'http:' && DB_URL.protocol !== 'https:') {
  throw new Error('Unknown DB URL protocol: ' +DB_URL.protocol);
}

const EXPECTED_API_KEY = process.env.API_KEY!
if (!EXPECTED_API_KEY) {
  throw new Error('Missing API key. Please set API_KEY in environment.')
}

function handler(client_req, client_res) {
  console.log('serve: ' + client_req.url);

  // console.log(client_req.headers)

  if (client_req.headers.get('x-api-key')!==EXPECTED_API_KEY) {
    client_res.writeHead(401)
    client_res.send('Invalid api key')
    client_res.end();
    return;
  }

  var options = {
    hostname: DB_URL.host,
    port: DB_URL.port,
    path: DB_URL.pathname + client_req.url.replace(/\.+/g, '.'),
    method: client_req.method,
    headers: {
      'Content-Type': client_req.headers.get('content-type'),
    },
  };
 
  const reqFn = DB_URL.protocol === 'https:'?requestHttps:request;

  var proxy = reqFn(options, function (res) {
    client_res.writeHead(res.statusCode, res.headers)
    res.pipe(client_res, {
      end: true
    });
  });

  client_req.pipe(proxy, {
    end: true
  });
}
