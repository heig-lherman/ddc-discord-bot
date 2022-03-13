import { queryCanteenMenu, RawMenu } from '#src/utils/canteen-menu-utils';
import { errorEmbed } from '#src/utils/embed-utils';
import { capitalize } from '#src/utils/string-utils';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import dayjs from 'dayjs';
import type { Message } from 'discord.js';
import { MessageEmbed } from 'discord.js';

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
            message.channel.send({
                embeds: [errorEmbed('The menus are not available')],
            });
            return;
        }

        const today = dayjs().locale('fr-ch');
        const startWeek = today.startOf('week').format(DAY_FORMAT);
        const endWeek = today.endOf('week').format(DAY_FORMAT);

        const embed = new MessageEmbed()
            .setColor('#EA580C')
            .setTitle(`:fork_and_knife: Menus de la semaine ${today.week()}`)
            .setThumbnail(
                'https://pbs.twimg.com/profile_images/1339474601097748480/PVp2lBhv_400x400.jpg',
            )
            .setFooter({
                text: `Semaine du ${startWeek} au ${endWeek}`,
            });

        Object.values(menus).forEach((menu: RawMenu, i) => {
            embed.addField(
                '-'.repeat(71),
                `**${capitalize(today.weekday(i).format('dddd'))}**`,
                false,
            );
            Object.entries(menu).forEach(([menuName, content]) => {
                const title = `\`\`\`Menu ${capitalize(menuName)}\`\`\``;
                embed.addField(title, content.join('\n'), true);
            });
        });

        message.channel.send({
            embeds: [embed],
        });
    }
}
