const path = require('path');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config({path: path.resolve(__dirname, '.env')});

const app = express();

const {PORT} = process.env;

app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
