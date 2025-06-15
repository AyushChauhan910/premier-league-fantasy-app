// server.js

import express from 'express';
const app = express();
const port = 3001; // You can change this port if needed

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


