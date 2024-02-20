import type { SapphireClient } from '@sapphire/framework';
import { ApiClient } from '@twurple/api';
import { AppTokenAuthProvider } from '@twurple/auth';
import type { EventSubStreamOnlineEvent } from '@twurple/eventsub-base';
import {
    EventSubHttpListener,
    ReverseProxyAdapter,
} from '@twurple/eventsub-http';

const TWITCH_USER_IDS = ['81936976', '756569499', '538667021'];

const authProvider = new AppTokenAuthProvider(
    process.env.TWITCH_CLIENT_ID ?? '',
    process.env.TWITCH_CLIENT_SECRET ?? '',
);

const apiClient = new ApiClient({ authProvider });
const listener = new EventSubHttpListener({
    apiClient,
    adapter: new ReverseProxyAdapter({
        hostName: process.env.TWITCH_EVENTSUB_DOMAIN ?? '',
        port: Number(process.env.TWITCH_EVENTSUB_LISTEN_PORT ?? 8080),
    }),
    secret: process.env.TWITCH_SUBSCRIPTION_SECRET ?? '',
    strictHostCheck: true,
});

export const twitchEventListener = listener;
export const subscribeTwitchEvents = async (client: SapphireClient) => {
    listener.start();
    TWITCH_USER_IDS.map((userId) =>
        listener.onStreamOnline(userId, (e) => {
            client.logger.info('streamOnline', e);
            client.emit('streamOnline', e);
        }),
    );
};

declare module 'discord.js' {
    interface ClientEvents {
        streamOnline: [event: EventSubStreamOnlineEvent];
    }
}
