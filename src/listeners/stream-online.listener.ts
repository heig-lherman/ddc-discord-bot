import { guildRef } from '../database/guild-data';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import type { EventSubStreamOnlineEvent } from '@twurple/eventsub-base';
import { EmbedBuilder, Snowflake } from 'discord.js';
import { getDocs } from 'firelord';

@ApplyOptions<Listener.Options>({
    event: 'streamOnline',
})
export default class StreamOnlineListener extends Listener {
    async run(event: EventSubStreamOnlineEvent) {
        const guilds = await getDocs(guildRef.collection()).then((docs) =>
            docs.docs
                .filter((d) => !!d.data().channels?.stream)
                .map((doc) => ({
                    id: doc.id,
                    channel: doc.data().channels.stream!,
                })),
        );

        const stream = await event.getStream();
        const game = await stream?.getGame();

        const streamUrl = `https://www.twitch.tv/${event.broadcasterName}`;

        const embed = new EmbedBuilder()
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

        embed.setImage(stream?.thumbnailUrl ?? null);

        await Promise.all(
            guilds.map(async ({ id, channel }) =>
                this.handleGuildMessage(id, channel, embed),
            ),
        );
    }

    private async handleGuildMessage(
        guildId: Snowflake,
        channelId: Snowflake,
        embed: EmbedBuilder,
    ) {
        const { client, logger } = this.container;

        const guild = await client.guilds.fetch(guildId);
        if (!guild) {
            logger.debug(`Could not find guild with id ${guildId}`);
            return;
        }

        const channel = await guild.channels.fetch(channelId);
        if (!channel || !channel.isTextBased()) {
            logger.debug(
                `Could not find menus channel in guild ${guild.toString()}.`,
            );
            return;
        }

        await channel.send({
            content: '<@&981902175850602566>',
            embeds: [embed],
        });
    }
}
