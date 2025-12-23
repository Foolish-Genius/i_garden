import http from 'http';
import fs from 'fs';
import path from 'path';

const port = process.env.PORT || 5173;
const dist = path.resolve(process.cwd(), 'dist');

const mime = {
  html: 'text/html',
  js: 'application/javascript',
  css: 'text/css',
  json: 'application/json',
  png: 'image/png',
  jpg: 'image/jpeg',
  svg: 'image/svg+xml',
  ico: 'image/x-icon',
};

const server = http.createServer((req, res) => {
  try {
    let filePath = path.join(dist, req.url.split('?')[0]);
    if (req.url === '/' || req.url === '') filePath = path.join(dist, 'index.html');

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath).slice(1);
    res.setHeader('Content-Type', mime[ext] || 'application/octet-stream');
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  } catch (err) {
    res.writeHead(500);
    res.end('Server error');
  }
});

server.listen(port, () => console.log(`Serving ./dist at http://localhost:${port}`));
