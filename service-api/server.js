const path    = require('path');
const morgan  = require('morgan');
const express = require('express');

const lutil = require('./lib/util.js');
const dirs = lutil.dirs(__dirname);

var app = express();
app.use(express.static(dirs.assets_dir));
app.use(morgan("common"));

// routes
app.get('/', require(`${dirs.lib_dir}/main.js`));
app.get('/api', require(`${dirs.api_dir}/api.js`));
app.get('/metrics', require(`${dirs.api_dir}/metrics.js`));

var port = process.env.PORT || 8080;
var server = app.listen(port, () => {
  console.log('Listening on port ' + port);
});

process.on("SIGINT", () => {
  process.exit(130 /* 128 + SIGINT */);
});

process.on("SIGTERM", () => {
  console.log("Terminating...");
  server.close();
});

process.on('uncaughtException', (err) => {
  if (!err) err = 'No further info.';
  console.log(`UncaughtException: ${err}`);
});

