import 'reflect-metadata';
import { Connection } from 'typeorm';
import express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';


require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

import { DatabaseManager } from './src/db/database-manager';
import { PermissionManager } from './src/db/permission-manager';
import { appRoutes } from './src/routes';
import { errorHandlerMiddleware } from './src/lib/middlewares';
import { processPermissions } from './src/lib/helpers';

const app: express.Application = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/v1', appRoutes);
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => next({ status: 404 }));
app.use(errorHandlerMiddleware);

const { SERVER_PORT } = process.env;

const connectionPromise = DatabaseManager.connect();

connectionPromise && connectionPromise.then(async (connection: Connection) => {
    try {
        DatabaseManager.setConnection(connection);
        // load permissions into the memory
        const rawPermissions = await PermissionManager.loadPermissions(connection);
        const processedPermissions = processPermissions(rawPermissions || []);
        PermissionManager.setPermissions(processedPermissions);
        // after db connection is established & permissions are loaded into memory we can start up the server
        app.listen(SERVER_PORT, () => console.log(`Example app listening on port ${SERVER_PORT}!`));
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
});
