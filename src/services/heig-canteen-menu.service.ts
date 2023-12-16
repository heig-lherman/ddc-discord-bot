import { groupBy } from '../utils/array-utils';
import { fieldValueOrEmpty } from '../utils/embed-utils';
import { capitalize } from '../utils/string-utils';
import { fetch, FetchResultTypes } from '@sapphire/fetch';
import { oneLine, oneLineTrim, stripIndent } from 'common-tags';
import dayjs from 'dayjs';
import { EmbedBuilder } from 'discord.js';

const DAY_FORMAT = 'DD MMMM YYYY';

const API_URL = 'https://top-chef-2023.vercel.app/menus';

export const queryWeekMenu = async (): Promise<ApiMenu[]> =>
    fetch<ApiMenu[]>(
        oneLineTrim`
            ${API_URL}
                ?from=${dayjs().startOf('week').format('YYYY-MM-DD')}
                &to=${dayjs().endOf('week').format('YYYY-MM-DD')}
        `,
        FetchResultTypes.JSON,
    );

export const queryDayMenu = async (): Promise<ApiMenu[]> =>
    fetch<ApiMenu[]>(
        oneLineTrim`
            ${API_URL}
                ?from=${dayjs().format('YYYY-MM-DD')}
                &to=${dayjs().format('YYYY-MM-DD')}
        `,
        FetchResultTypes.JSON,
    );

export const isMenuIncomplete = (menu: ApiMenu) =>
    !menu.main || menu.main.length === 0 || !menu.main[0];

export const addMenusToFields = (embed: EmbedBuilder, menus: ApiMenu[]) => {
    let counter = 0;
    menus.forEach((m) => {
        if (isMenuIncomplete(m)) {
            return;
        }

        const title = `\`\`\`Menu ${++counter}\`\`\``;
        embed.addFields({
            name: title,
            value: fieldValueOrEmpty(stripIndent`
                ${m.starter}
                ${m.main.join('\n')}
                ${m.dessert}
            `),
            inline: true,
        });
    });
};

export const buildWeekMenuEmbed = (menu: ApiMenu[]): EmbedBuilder => {
    const embed = new EmbedBuilder()
        .setColor('#EA580C')
        .setTitle(`:fork_and_knife: Menus de la semaine ${dayjs().week()}`)
        .setFooter({
            text: oneLine`
                Semaine
                du ${dayjs(menu[0]?.date).format(DAY_FORMAT)}
                au ${dayjs(menu[menu.length]?.date).format(DAY_FORMAT)}
            `,
        });

    Object.entries(groupBy(menu, (m) => m.date)).forEach(([date, menus]) => {
        embed.addFields({
            name: '-'.repeat(80),
            value: oneLineTrim`
                    **${capitalize(dayjs(date).format('dddd'))}**
                `,
            inline: false,
        });
        addMenusToFields(embed, menus);
    });

    return embed;
};

export const buildDayMenuEmbed = (menu: ApiMenu[]): EmbedBuilder => {
    const embed = new EmbedBuilder().setColor('#EA580C').setTitle(
        oneLine`:fork_and_knife: Menus du
                ${dayjs(menu[0]?.date).format('dddd LL')}`,
    );
    addMenusToFields(embed, menu);
    return embed;
};

export interface ApiMenu {
    _id: string;
    date: string;
    starter: string;
    main: string[];
    dessert: string;
}
