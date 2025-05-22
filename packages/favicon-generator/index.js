const http = require('http');
const fs = require('fs');
const path = require('path');

// Port for the server
const PORT = 3030;

// Create HTTP server
const server = http.createServer((req, res) => {
  // Serve the HTML file
  if (req.url === '/' || req.url === '/index.html') {
    const htmlPath = path.join(__dirname, 'index.html');
    fs.readFile(htmlPath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end(`Error loading index.html: ${err.message}`);
        return;
      }
      
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    });
    return;
  }
  
  // Handle 404
  res.writeHead(404);
  res.end('Not found');
});

// Start the server
server.listen(PORT, () => {
  console.log(`
  ┌───────────────────────────────────────────────┐
  │                                               │
  │   IGS Pharma Favicon Generator                │
  │                                               │
  │   Server running at http://localhost:${PORT}    │
  │                                               │
  │   Open this URL in your browser to use        │
  │   the favicon generator tool.                 │
  │                                               │
  └───────────────────────────────────────────────┘
  `);
});
