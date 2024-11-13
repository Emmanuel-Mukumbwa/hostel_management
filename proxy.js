const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 5000; // You can choose any port

app.get('/paychangu-script', async (req, res) => {
  try {
    const response = await axios.get('https://paychangu.com/inline-js');
    res.set('Content-Type', 'application/javascript');
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching script');
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
