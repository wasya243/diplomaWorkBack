import 'reflect-metadata';

import { Connection } from 'typeorm';
import express = require('express');
import path = require('path');
import bodyParser = require('body-parser');


require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

import { DatabaseManager } from './connection';
// import {getUserById, createUser, deleteUser, updateUser, getUsers} from './queries';
import { getUsers, createUser, getUserById, deleteUser, updateUser } from './queries';

const app: express.Application = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req: express.Request, res: express.Response) {
    res.send('Hello World!');
});

app.get('/users', getUsers);
app.get('/users/:id', getUserById);
app.post('/users', createUser);
app.put('/users/:id', updateUser);
app.delete('/users/:id', deleteUser);

const { SERVER_PORT } = process.env;

const connectionPromise = DatabaseManager.connect();

connectionPromise && connectionPromise.then((connection: Connection) => {
    DatabaseManager.setConnection(connection);
    app.listen(SERVER_PORT, () => console.log(`Example app listening on port ${SERVER_PORT}!`));
});


