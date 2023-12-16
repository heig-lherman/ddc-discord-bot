import {
    APIDayMenuModel,
    buildDayMenuEmbed,
    queryDayMenu,
} from '../services/heig-canteen-menu.service';
import { findChannelByName } from '../utils/discord-collection-utils';
import { ApplyOptions } from '@sapphire/decorators';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import type { Guild, Snowflake } from 'discord.js';

const GUILDS: Snowflake[] = ['887670429760749569'];

@ApplyOptions<ScheduledTask.Options>({
    pattern: '0 10 * * 1-5',
    enabled: true,
})
export default class CanteenMenuTask extends ScheduledTask {
    public override async run() {
        const { client, logger } = this.container;

        const menu = await queryDayMenu();
        if (!menu) {
            logger.error('Could not find menu of the day');
            return;
        }

        const guilds = await Promise.all(
            GUILDS.map((sf) => client.guilds.cache.get(sf)),
        );
        guilds.forEach((guild) => {
            if (guild) {
                this.handleGuildMenu(guild, menu).catch(logger.error);
            }
        });
    }

    private async handleGuildMenu(
        guild: Guild,
        menu: APIDayMenuModel,
    ): Promise<void> {
        const { logger } = this.container;

        const channel = findChannelByName(guild, 'menus');
        if (!channel) {
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
