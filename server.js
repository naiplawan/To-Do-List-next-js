const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { WebSocketServer } = require('ws');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('Client connected');

    // Set up ping-pong mechanism to keep the connection alive
    const pingInterval = setInterval(() => {
      if (ws.readyState === ws.OPEN) {
        ws.ping();
      }
    }, 30000); // Ping every 30 seconds

    ws.on('pong', () => {
      console.log('Received pong from client');
    });

    ws.on('message', (message) => {
      const data = JSON.parse(message);
      console.log('Received:', data);

      ws.send(JSON.stringify({ message: 'Server received your message' }));
    });

    ws.on('close', () => {
      console.log('Client disconnected');
      clearInterval(pingInterval);
    });

    ws.on('error', (err) => {
      console.error('WebSocket error:', err);
    });
  });

  server.listen(5000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:5000');
  });
});
