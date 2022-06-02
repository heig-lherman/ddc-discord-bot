import type { SapphireClient } from '@sapphire/framework';
import { ApiClient } from '@twurple/api';
import { ClientCredentialsAuthProvider } from '@twurple/auth';
import { EventSubListener, ReverseProxyAdapter } from '@twurple/eventsub';
import type { EventSubStreamOnlineEvent } from '@twurple/eventsub/lib/events/EventSubStreamOnlineEvent';
import { randomBytes } from 'crypto';

const TWITCH_USER_IDS = ['756569499'];
const SUBSCRIPTION_SECRET: string = randomBytes(48).toString('hex');

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
});

export const subscribeTwitchEvents = async (client: SapphireClient) => {
    await twitchEventSubListener.listen().catch(console.error);
    const subscriptions = await Promise.all(
        TWITCH_USER_IDS.map(async (userId) =>
            twitchEventSubListener.subscribeToStreamOnlineEvents(
                userId,
                (e) => {
                    client.emit('streamOnline', e);
                },
            ),
        ),
    );

    await Promise.all(
        subscriptions.map(async (sub, i) =>
            client.logger.info(`[${i}] => ${await sub.getCliTestCommand()}`),
        ),
    );
};

declare module 'discord.js' {
    interface ClientEvents {
        streamOnline: [event: EventSubStreamOnlineEvent];
    }
}
