const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const LimitSizeStream = require('./LimitSizeStream');
const MAX_SIZE = 1000000;

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = new url.URL(req.url, `${req.protocol}://${req.headers.host}`).pathname.slice(1);
  if (!pathname || pathname.includes('/')) {
    res.statusCode = 400;
    res.end('Bad request');
    return false;
  }

  const filepath = path.join(__dirname, 'files', pathname);
  const limitedStream = new LimitSizeStream({limit: MAX_SIZE, encoding: 'utf-8'});

  limitedStream.on('error', (e) => {
    fs.unlink(filepath, (err) => console.dir(err));
    res.statusCode = 413;
    res.end('Too much size!');
  });
  req.connection.on('close', function(err) {
    fs.unlink(filepath, (err) => console.dir(err));
  });

  switch (req.method) {
    case 'POST':
      try {
        if (fs.existsSync(filepath)) {
          res.statusCode = 409;
          res.end('File Exists');
          return;
        } else {
          const fileWright = fs.createWriteStream(filepath);

          fileWright.on('finish', function() {
            res.writeHead(201, {
              'Access-Control-Allow-Origin': '*',
            });
            res.end('Success');
          });
          req.pipe(limitedStream).pipe(fileWright);
        }
      } catch (error) {
        res.statusCode = 500;
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
