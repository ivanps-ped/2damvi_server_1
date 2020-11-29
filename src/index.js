const express = require("express");
const bodyParser = require("body-parser");
var api = require("./api");
const app = express()
var subpath = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('dist'));

var swagger = require('swagger-node-express').createNew(subpath);

// Set api-doc path
swagger.configureSwaggerPaths('', 'api-docs', '');

// Configure the API domain
var domain = '0.0.0.0';

// Configure the API port
const PORT = process.env.PORT || 3000;

// Set and display the application URL
var applicationUrl = 'https://' + domain + ':' + PORT;

swagger.configure(applicationUrl, '1.0.0');

api(app);
// Start the web server
app.listen(PORT, () => {
});