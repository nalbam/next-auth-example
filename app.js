const express = require('express');
const next = require('next');
const path = require('path');

const dev = true;
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const app = express();

app.all('*', (req, res) => {
  return handle(req, res);
});

module.exports = app;
