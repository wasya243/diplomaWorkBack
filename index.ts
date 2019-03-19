import 'reflect-metadata';

import { Connection } from 'typeorm';
import express = require('express');
import path = require('path');
import bodyParser = require('body-parser');


require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

import { DatabaseManager } from './src/db/database-manager';
import { appRoutes } from './src/routes';

const app: express.Application = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/v1', appRoutes);

const { SERVER_PORT } = process.env;

const connectionPromise = DatabaseManager.connect();

connectionPromise && connectionPromise.then((connection: Connection) => {
    DatabaseManager.setConnection(connection);
    app.listen(SERVER_PORT, () => console.log(`Example app listening on port ${SERVER_PORT}!`));
});


