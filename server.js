const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000; // Choose a port for your server

// Serve static files from the 'build' folder
app.use(express.static(path.join(__dirname, 'public')));

// Handle all other requests by serving the main index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});