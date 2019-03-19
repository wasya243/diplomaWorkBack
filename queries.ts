import pg = require('pg');
import express = require('express');


const { USER, HOST, DATABASE, PASSWORD } = process.env;
const DB_PORT: number = parseInt(process.env.DB_PORT || '');

const connectionConfig: pg.ConnectionConfig = {
    user: USER,
    host: HOST,
    database: DATABASE,
    password: PASSWORD,
    port: DB_PORT
};

const pool = new pg.Pool(connectionConfig);

export const getUsers = (request: express.Request, response: express.Response) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};

export const getUserById = (request: express.Request, response: express.Response) => {
    const id = parseInt(request.params.id);

    pool.query('SELECT * FROM users WHERE id = $1', [ id ], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};

export const createUser = (request: express.Request, response: express.Response) => {
    const { name, email } = request.body;

    pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [ name, email ], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(201).send(`User added with ID: ${results.oid}`);
    });
};

export const updateUser = (request: express.Request, response: express.Response) => {
    const id = parseInt(request.params.id);
    const { name, email } = request.body;

    pool.query(
        'UPDATE users SET name = $1, email = $2 WHERE id = $3',
        [ name, email, id ],
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).send(`User modified with ID: ${id}`);
        }
    );
};

export const deleteUser = (request: express.Request, response: express.Response) => {
    const id = parseInt(request.params.id);

    pool.query('DELETE FROM users WHERE id = $1', [ id ], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).send(`User deleted with ID: ${id}`);
    });
};
