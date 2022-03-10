import 'dotenv/config';
import path from 'path';
import { credential, initializeApp } from 'firebase-admin';

import { Bot } from './framework';

initializeApp({
    credential: credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
    }),
});

export const bot = new Bot({
    token: process.env.DISCORD_TOKEN,
    commands: path.join(__dirname, 'commands'),
    crons: path.join(__dirname, 'crons'),
    // formatCheckers: path.join(__dirname, 'format-checkers'),
});

bot.start().then(() => {
    bot.logger.info('Bot started');
});
