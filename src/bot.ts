// eslint-disable-next-line import/order
import 'dotenv/config';
import './lib/setup';

import { subscribeTwitchEvents } from './services/twitch-events.service';
import { LogLevel, SapphireClient } from '@sapphire/framework';
import { GatewayIntentBits } from 'discord.js';

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
    logger: { level: LogLevel.Debug },
    hmr: { enabled: process.env.NODE_ENV === 'development' },
    tasks: {
        bull: {
            connection: {
                host: process.env.REDIS_HOST ?? 'localhost',
                port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
                password: process.env.REDIS_PASSWORD,
                db: parseInt(process.env.REDIS_DB ?? '0', 10),
            },
            defaultJobOptions: {
                removeOnComplete: true,
                removeOnFail: true,
            },
        },
        queue: 'ddc-tasks',
    },
    loadMessageCommandListeners: true,
    loadDefaultErrorListeners: true,
    loadSubcommandErrorListeners: true,
    loadScheduledTaskErrorListeners: true,
});

const main = async () => {
    try {
        client.logger.info('Logging in');

        await client.login(process.env.DISCORD_TOKEN).then(() => {
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

            subscribeTwitchEvents(client).catch(client.logger.error);
        });
    } catch (error) {
        client.logger.fatal(error);
        client.destroy();
        process.exit(1);
    }
};

// eslint-disable-next-line no-console
main().catch(console.error);
