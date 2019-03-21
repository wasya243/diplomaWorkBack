import * as jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || '';
const algorithm = 'HS512';

export function sign(payload: string | Buffer | object, expiresIn = '3h'): Promise<string> {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, secret, { algorithm, expiresIn }, (error: Error, token: string) => error ? reject(error) : resolve(token));
    });
}

// TODO: maybe specify type for payload other than any?
export function verify(token: string): Promise<object | any> {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, { algorithms: [ algorithm ] }, (error: Error, payload: any | string) => error ? reject(error) : resolve(payload));
    });
}
