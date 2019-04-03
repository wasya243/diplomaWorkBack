const hbs = require('nodemailer-express-handlebars');
import path = require('path');
import nodemailer = require('nodemailer');

const email = process.env.MAILER_EMAIL_ID || 'auth_email_address@gmail.com';
const pass = process.env.MAILER_PASSWORD || 'auth_email_pass';

const smtpTransport = nodemailer.createTransport({
    service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
    auth: {
        user: email,
        pass
    }
});

const viewPath = path.resolve(__dirname.split('/build')[ 0 ], './public/templates');

const handlebarsOptions = {
    viewEngine: {
        extName: '.html',
        partialsDir: viewPath,
        layoutsDir: viewPath,
        defaultLayout: 'reset-password-email.html',
    },
    viewPath,
    extName: '.html',
};

smtpTransport.use('compile', hbs(handlebarsOptions));

export function sendMail(emailSendTo: string, subject: string, templateName: string, context: any) {
    const data = {
        to: emailSendTo,
        from: email,
        template: templateName,
        subject,
        context
    };

    return smtpTransport.sendMail(data);
}

export function sendResetPasswordEmail(emailSendTo: string, context: any) {

    const data = {
        to: emailSendTo,
        from: email,
        template: 'reset-password-email',
        subject: 'Password reset.',
        context
    };

    return smtpTransport.sendMail(data);
}
