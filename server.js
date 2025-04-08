// server.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Enable CORS
app.use(cors());

// Accept JSON payloads
app.use(express.json());

// Optional: serve static files (e.g., bar-race.html)
app.use('/static', express.static(path.join(__dirname, 'public')));

// Proxy GraphQL requests
app.post('/graphql', async (req, res) => {
  try {
    const response = await fetch('https://api-preview.apps.angrydynomiteslab.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Proxy error:', err.message);
    res.status(500).json({ error: 'Proxy server error', details: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🌐 Proxy server running at http://localhost:${PORT}`);
});
