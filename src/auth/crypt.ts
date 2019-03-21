import crypto = require('crypto');

const DIPLOMA_WORK_SALT = process.env.DIPLOMA_WORK_SALT || '';

export function encryptPassword(password: string): Promise<Error | string> {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, DIPLOMA_WORK_SALT, 10, 64, 'sha512', (error: Error | null, derivedKey: Buffer) => {
            error ? reject(error) : resolve(derivedKey.toString('hex'));
        });
    });
}


export async function verifyPassword(rawPassword: string, encryptedPassword: string): Promise<boolean> {
    return encryptedPassword === (await encryptPassword(rawPassword));
}
