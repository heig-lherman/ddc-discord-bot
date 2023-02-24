import type { SapphireClient } from '@sapphire/framework';
import { ApiClient } from '@twurple/api';
import { AppTokenAuthProvider } from '@twurple/auth';
import type { EventSubStreamOnlineEvent } from '@twurple/eventsub-base';
import { EventSubWsListener } from '@twurple/eventsub-ws';

const TWITCH_USER_IDS = ['81936976', '756569499', '538667021'];

const apiClient = new ApiClient({
    authProvider: new AppTokenAuthProvider(
        process.env.TWITCH_CLIENT_ID ?? '',
        process.env.TWITCH_CLIENT_SECRET ?? '',
    ),
});

const listener = new EventSubWsListener({ apiClient });
listener.start();

export const twitchEventListener = listener;
export const subscribeTwitchEvents = async (client: SapphireClient) => {
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
