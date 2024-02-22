import { guildRef } from '../database/guild-data';
import {
    ApiMenu,
    buildDayMenuEmbed,
    queryDayMenu,
} from '../services/heig-canteen-menu.service';
import { ApplyOptions } from '@sapphire/decorators';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import { Snowflake } from 'discord.js';
import { getDocs } from 'firelord';

@ApplyOptions<ScheduledTask.Options>({
    pattern: '0 10 * * 1-5',
    timezone: 'Europe/Zurich',
    enabled: true,
})
export default class CanteenMenuTask extends ScheduledTask {
    public override async run() {
        const { logger } = this.container;

        const menu = await queryDayMenu();
        if (!menu) {
            logger.error('Could not find menu of the day');
            return;
        }

        const guilds = await getDocs(guildRef.collection()).then((docs) =>
            docs.docs
                .filter((d) => !!d.data().channels?.menus)
                .map((doc) => ({
                    guild: doc.id,
                    channel: doc.data().channels.menus!,
                })),
        );

        await Promise.all(
            guilds.map(async ({ guild, channel }) =>
                this.handleGuildMenu(guild, channel, menu),
            ),
        );
    }

    private async handleGuildMenu(
        guildId: Snowflake,
        channelId: Snowflake,
        menu: ApiMenu[],
    ): Promise<void> {
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
            embeds: [buildDayMenuEmbed(menu)],
        });
    }
}
