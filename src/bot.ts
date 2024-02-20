// eslint-disable-next-line import/order
import 'dotenv/config';
import './lib/setup';

import { subscribeTwitchEvents } from './services/twitch-events.service';
import { container, LogLevel, SapphireClient } from '@sapphire/framework';
import { GatewayIntentBits } from 'discord.js';

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
        bull: {
            connection: {
                host: host ?? '',
                port: port ?? 6379,
                password: password ?? '',
                db: db ?? 0,
            },
            prefix: 'ddc.queue-',
        },
    },
    loadMessageCommandListeners: true,
    loadDefaultErrorListeners: true,
    loadSubcommandErrorListeners: true,
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

        client.logger.info('logged in');
    } catch (error) {
        client.logger.fatal(error);
        client.destroy();
        process.exit(1);
    }
};

// eslint-disable-next-line no-console
main().catch(console.error);
