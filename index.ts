import 'reflect-metadata';
import { Connection } from 'typeorm';
import express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';


require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

import { DatabaseManager } from './src/db/database-manager';
import { appRoutes } from './src/routes';
import { errorHandlerMiddleware } from './src/lib/middlewares';

const app: express.Application = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/v1', appRoutes);
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => next({ status: 404 }));
app.use(errorHandlerMiddleware);

const { SERVER_PORT } = process.env;

const connectionPromise = DatabaseManager.connect();

connectionPromise && connectionPromise.then((connection: Connection) => {
    DatabaseManager.setConnection(connection);
    app.listen(SERVER_PORT, () => console.log(`Example app listening on port ${SERVER_PORT}!`));
});
