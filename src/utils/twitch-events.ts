import type { SapphireClient } from '@sapphire/framework';
import { ApiClient } from '@twurple/api';
import { ClientCredentialsAuthProvider } from '@twurple/auth';
import { EventSubListener, ReverseProxyAdapter } from '@twurple/eventsub';
import type { EventSubStreamOnlineEvent } from '@twurple/eventsub/lib/events/EventSubStreamOnlineEvent';

const TWITCH_USER_IDS = ['81936976', '756569499', '538667021'];
const SUBSCRIPTION_SECRET: string | undefined =
    process.env.TWITCH_SUBSCRIPTION_SECRET;

if (!SUBSCRIPTION_SECRET) {
    throw new Error('Missing TWITCH_SUBSCRIPTION_SECRET');
}

export const twitchAuthProvider = new ClientCredentialsAuthProvider(
    process.env.TWITCH_CLIENT_ID ?? '',
    process.env.TWITCH_CLIENT_SECRET ?? '',
);

export const twitchApiClient = new ApiClient({
    authProvider: twitchAuthProvider,
});

export const twitchEventSubListener = new EventSubListener({
    apiClient: twitchApiClient,
    adapter: new ReverseProxyAdapter({
        hostName: 'ddc.cc4.ch',
        port: 1042,
    }),
    secret: SUBSCRIPTION_SECRET,
    strictHostCheck: true,
});

export const subscribeTwitchEvents = async (client: SapphireClient) => {
    await twitchEventSubListener.listen().catch(console.error);
    await Promise.all(
        TWITCH_USER_IDS.map(async (userId) =>
            twitchEventSubListener.subscribeToStreamOnlineEvents(
                userId,
                (e) => {
                    client.emit('streamOnline', e);
                },
            ),
        ),
    );
};

declare module 'discord.js' {
    interface ClientEvents {
        streamOnline: [event: EventSubStreamOnlineEvent];
    }
}
