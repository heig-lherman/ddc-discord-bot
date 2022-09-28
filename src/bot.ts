// eslint-disable-next-line import/order
import 'dotenv/config';

import dayjsParser from '#src/utils/dayjs-parser';
import { subscribeTwitchEvents } from '#src/utils/twitch-events';
import { container, LogLevel, SapphireClient } from '@sapphire/framework';
import '@sapphire/plugin-editable-commands/register';
import '@sapphire/plugin-hmr/register';
import '@sapphire/plugin-logger/register';
import { ScheduledTaskRedisStrategy } from '@sapphire/plugin-scheduled-tasks/register-redis';
import dayjs from 'dayjs';
import 'dayjs/locale/fr-ch';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekday from 'dayjs/plugin/weekday';
import { GatewayIntentBits } from 'discord-api-types/v10';
import { cert, initializeApp } from 'firebase-admin/app';
import { type Firestore, getFirestore } from 'firebase-admin/firestore';
import IORedis, { type Redis } from 'ioredis';

dayjs.extend(utc);
dayjs.extend(weekOfYear);
dayjs.extend(weekday);
dayjs.extend(localizedFormat);
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(dayjsParser);

initializeApp({
    credential: cert(process.env.FIREBASE_CREDENTIALS_PATH ?? ''),
});

container.database = getFirestore();

container.redisClient = new IORedis(process.env.REDIS_URL ?? '');
const { host, port, password, db } = container.redisClient.options;

const client = new SapphireClient({
    defaultPrefix: '!',
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.MessageContent,
    ],
    logger: {
        level: LogLevel.Debug,
    },
    tasks: {
        strategy: new ScheduledTaskRedisStrategy({
            bull: {
                connection: {
                    host,
                    port,
                    password,
                    db,
                },
                prefix: 'ddc.queue-',
            },
        }),
    },
    hmr: {
        enabled: process.env.NODE_ENV === 'development',
    },
    loadMessageCommandListeners: true,
    loadDefaultErrorListeners: true,
    loadSubcommandErrorListeners: true,
});

client
    .login(process.env.DISCORD_TOKEN)
    .then(() => {
        client.logger.info('Successfully connected');
        client.logger.debug(
            'Loaded',
            client.stores.get('commands').size,
            'commands',
        );
        client.logger.debug(
            'Loaded',
            client.stores.get('scheduled-tasks').size,
            'tasks',
        );

        return subscribeTwitchEvents(client).catch(client.logger.error);
    })
    // eslint-disable-next-line no-console
    .catch(console.error);

declare module '@sapphire/pieces' {
    interface Container {
        redisClient: Redis;
        database: Firestore;
    }
}
