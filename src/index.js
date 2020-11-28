const express = require("express");
const bodyParser = require("body-parser");
var api = require("./api");
const app = express()
var subpath = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('dist'));
api(app);

app.use("/v1", subpath);
var swagger = require('swagger-node-express').createNew(subpath);

var argv = require('minimist')(process.argv.slice(2));

// Set api-doc path
swagger.configureSwaggerPaths('', 'api-docs', '');

// Configure the API domain
var domain = 'localhost';
if (argv.domain !== undefined)
    domain = argv.domain;
else
    console.log('No --domain=xxx specified, taking default hostname "localhost".')

// Configure the API port
var port = 3000;
if (argv.port !== undefined)
    port = argv.port;
else
    console.log('No --port=xxx specified, taking default port ' + port + '.')

// Set and display the application URL
var applicationUrl = 'http://' + domain + ':' + port;
console.log('snapJob API running on ' + applicationUrl);

swagger.configure(applicationUrl, '1.0.0');

// Start the web server
app.listen(port);