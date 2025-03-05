# Serverless

## Install

```bash
npm i -g serverless
```

## Install dependencies

```bash
pnpm i express
pnpm i @vendia/serverless-express source-map-support
```

## Create app.js

```js
const express = require('express');
const next = require('next');
const path = require('path');

const dev = false;
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const app = express();

app.all('*', (req, res) => {
  return handle(req, res);
});

module.exports = app;
```

## Create app-local.js

```js
const app = require('./app');

app.listen(3000, () => console.log('http://localhost:3000'));
```

```bash
node app-local.js
```

## Create serverless.yml

```yml

```
