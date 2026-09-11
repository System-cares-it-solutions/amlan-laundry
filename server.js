const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.mp4': 'video/mp4'
};

const server = http.createServer((req, res) => {
  // Parse requested URL
  const parsedUrl = url.parse(req.url);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Normalize path
  if (pathname === '/') {
    pathname = '/index.html';
  }

  // Prevent directory traversal
  const safeSuffix = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(PUBLIC_DIR, safeSuffix);

  // Check if direct file exists
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Try appending .html (clean URL support)
      const htmlPath = filePath + '.html';
      fs.stat(htmlPath, (htmlErr, htmlStats) => {
        if (!htmlErr && htmlStats.isFile()) {
          serveFile(htmlPath, res);
        } else {
          // 404 Not Found
          res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(`<h1>404 Not Found</h1><p>The requested file <code>${pathname}</code> was not found.</p><a href="/">Back to Home</a>`);
        }
      });
      return;
    }

    serveFile(filePath, res);
  });
});

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('500 - Internal Server Error');
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });
    res.end(content);
  });
}

server.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`The Amlan Laundry Server running!`);
  console.log(`Local URL: http://localhost:${PORT}`);
  console.log(`=========================================`);
});
