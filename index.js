const express = require("express");
const bodyParser = require("body-parser");
var api = require("/api");
const app = express();
const swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
api(app);

app.listen(3000, () => {
    console.log("El servidor está inicializado en el puerto 3000");
});