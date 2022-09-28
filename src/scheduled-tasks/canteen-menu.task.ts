import {
    queryCanteenMenuOfTheDay,
    type RawMenu,
} from '#src/utils/canteen-menu-utils';
import { findChannelByName } from '#src/utils/discord-collection-utils';
import { fieldValueOrEmpty } from '#src/utils/embed-utils';
import { capitalize } from '#src/utils/string-utils';
import { ApplyOptions } from '@sapphire/decorators';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import dayjs from 'dayjs';
import type { Snowflake } from 'discord-api-types/globals';
import type { Guild } from 'discord.js';
import { MessageEmbed } from 'discord.js';

const GUILDS: Snowflake[] = ['887670429760749569'];

@ApplyOptions<ScheduledTask.Options>({
    cron: '0 10 * * 1-5',
    enabled: true,
})
export default class CanteenMenuTask extends ScheduledTask {
    public override async run() {
        const { client, logger } = this.container;

        const menu = await queryCanteenMenuOfTheDay();
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

    private async handleGuildMenu(guild: Guild, menu: RawMenu): Promise<void> {
        const { logger } = this.container;

        const channel = findChannelByName(guild, 'menus');
        if (!channel) {
            logger.debug(
                `Could not find menus channel in guild ${guild.toString()}.`,
            );
            return;
        }

        const today = dayjs().locale('fr-ch');

        const embed = new MessageEmbed()
            .setColor('#EA580C')
            .setTitle(`:fork_and_knife: Menus du ${today.format('dddd LL')}`)
            .setThumbnail(
                'https://pbs.twimg.com/profile_images/1339474601097748480/PVp2lBhv_400x400.jpg',
            );

        Object.entries(menu).forEach(([name, content]) => {
            const title = `\`\`\`Menu ${capitalize(name)}\`\`\``;
            embed.addFields({
                name: title,
                value: fieldValueOrEmpty(content.join('\n')),
                inline: true,
            });
        });

        await channel.send({
            embeds: [embed],
        });
    }
}
