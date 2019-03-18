const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config({path: path.resolve(__dirname, '.env')});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
	res.json({info: 'Node.js, Express, and Postgres API'});
});

const {PORT} = process.env;

app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
