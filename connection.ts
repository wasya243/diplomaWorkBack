import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';
import { User } from './User';

const { USER, HOST, DATABASE, PASSWORD } = process.env;
const DB_PORT: number = parseInt(process.env.DB_PORT || '');

export class DatabaseManager {
    private static connection: Connection;

    public static setConnection(connection: Connection): void {
        if (!DatabaseManager.connection) {
            DatabaseManager.connection = connection;
        }
    }

    public static getConnection(): Connection | undefined {
        return DatabaseManager.connection;
    }

    public static connect(): Promise<Connection> | undefined {
        if (!DatabaseManager.connection) {
            return createConnection({
                type: 'postgres',
                host: HOST,
                port: DB_PORT,
                username: USER,
                password: PASSWORD,
                database: DATABASE,
                entities: [
                    User
                ],
                synchronize: true,
                logging: false
            });
        }
    }
}


