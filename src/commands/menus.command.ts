import { queryCanteenMenu, RawMenu } from '#src/utils/canteen-menu-utils';
import { errorEmbed, fieldValueOrEmpty } from '#src/utils/embed-utils';
import { capitalize } from '#src/utils/string-utils';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import dayjs from 'dayjs';
import type { Message } from 'discord.js';
import { EmbedBuilder } from 'discord.js';

const DAY_FORMAT = 'DD MMMM YYYY';

@ApplyOptions<Command.Options>({
    name: 'menus',
    description: 'Display the menus of the week at the HEIG-VD',
    enabled: true,
})
export default class MenusCommand extends Command {
    public override async messageRun(message: Message) {
        const menus = await queryCanteenMenu();

        if (!Object.keys(menus).length) {
            return send(message, {
                embeds: [errorEmbed('The menus are not available')],
            });
        }

        const today = dayjs().locale('fr-ch');
        const startWeek = today.startOf('week').format(DAY_FORMAT);
        const endWeek = today.endOf('week').format(DAY_FORMAT);

        const embed = new EmbedBuilder()
            .setColor('#EA580C')
            .setTitle(`:fork_and_knife: Menus de la semaine ${today.week()}`)
            .setFooter({
                text: `Semaine du ${startWeek} au ${endWeek}`,
            });

        Object.values(menus).forEach((menu: RawMenu, i) => {
            embed.addFields({
                name: '-'.repeat(71),
                value: `**${capitalize(today.weekday(i).format('dddd'))}**`,
                inline: false,
            });
            Object.entries(menu).forEach(([menuName, content]) => {
                const title = `\`\`\`Menu ${capitalize(menuName)}\`\`\``;
                embed.addFields({
                    name: title,
                    value: fieldValueOrEmpty(content.join('\n')),
                    inline: true,
                });
            });
        });

        return send(message, { embeds: [embed] });
    }
}
