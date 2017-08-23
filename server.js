const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(express.static('public'));

app.listen(process.env.PORT || 8080);