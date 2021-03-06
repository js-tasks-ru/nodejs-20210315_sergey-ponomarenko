const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');


const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = new url.URL(req.url, `${req.protocol}://${req.headers.host}`).pathname.slice(1);
  if (!pathname || pathname.includes('/')) {
    res.statusCode = 400;
    res.end('Bad request');
    return false;
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      try {
        if (fs.existsSync(filepath)) {
          const filename = path.basename(filepath);
          res.setHeader('Content-disposition', 'attachment; filename=' + filename);
          const filestream = fs.createReadStream(filepath);
          res.statusCode = 200;
          filestream.pipe(res);
        } else {
          res.statusCode = 404;
          res.end('Not found');
        }
      } catch (error) {
        console.log(error);
      }
      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
