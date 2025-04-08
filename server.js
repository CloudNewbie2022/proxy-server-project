// server.js
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

const cors = require('cors');
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Accept', 'X-Requested-With']
}));

app.use(express.json());

// Debug logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length) {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Serve static files (optional)
app.use('/static', express.static(path.join(__dirname, 'public')));

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
    console.log('✅ Forwarded response:', JSON.stringify(data, null, 2));
    res.status(response.status).json(data);
  } catch (err) {
    console.error('❌ Proxy error:', err.message);
    res.status(500).json({ error: 'Proxy server error', details: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('🌐 Elemental Proxy Server is running.');
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
