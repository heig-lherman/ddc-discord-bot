import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import type { EventSubStreamOnlineEvent } from '@twurple/eventsub/lib/events/EventSubStreamOnlineEvent';
import type { Snowflake } from 'discord-api-types/globals';
import { MessageEmbed } from 'discord.js';

const GUILDS: { id: Snowflake; channel: Snowflake }[] = [
    { id: '887670429760749569', channel: '981888025095196702' },
];

@ApplyOptions<Listener.Options>({
    event: 'streamOnline',
})
export default class StreamOnlineListener extends Listener {
    async run(event: EventSubStreamOnlineEvent): Promise<unknown> {
        const { client } = this.container;

        const stream = await event.getStream();
        const game = await stream?.getGame();

        const streamUrl = `https://www.twitch.tv/${event.broadcasterName}`;

        const channels = await Promise.all(
            GUILDS.map((sfs) => client.channels.cache.get(sfs.channel)),
        );

        const embed = new MessageEmbed()
            .setColor('#9146FF')
            .setTitle(
                `:tv: ${event.broadcasterDisplayName} - Stream en ligne !`,
            )
            .setURL(streamUrl)
            .addFields({
                name: 'Titre',
                value: stream?.title || 'Aucun titre',
            });

        if (game) {
            embed.addFields({ name: 'Jeu', value: game.name || 'Aucun jeu' });
            embed.setThumbnail(game.boxArtUrl);
        }

        embed.setImage(stream?.thumbnailUrl);

        return channels.map((channel) => {
            if (channel && channel.isText()) {
                return channel.send({
                    content: '<@&981902175850602566>',
                    embeds: [embed],
                });
            }

            return Promise.resolve();
        });
    }
}
