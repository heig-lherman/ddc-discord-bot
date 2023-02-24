import { fieldValueOrEmpty } from '#src/utils/embed-utils';
import { capitalize } from '#src/utils/string-utils';
import { fetch, FetchResultTypes } from '@sapphire/fetch';
import { oneLine, oneLineTrim, stripIndent } from 'common-tags';
import dayjs from 'dayjs';
import { EmbedBuilder } from 'discord.js';

const DAY_FORMAT = 'DD MMMM YYYY';

const WEEK_API_URL = 'https://top-chef-intra-api.blacktree.io/weeks/current';
const DAY_API_URL = 'https://apix.blacktree.io/top-chef/today';

const apiHeaders = new Headers();
apiHeaders.append('x-api-key', process.env.TOP_CHEF_API_KEY ?? '');

export const queryWeekMenu = async (): Promise<APIWeekMenuModel> =>
    fetch<APIWeekMenuModel>(
        WEEK_API_URL,
        { headers: apiHeaders },
        FetchResultTypes.JSON,
    );

export const queryDayMenu = async (): Promise<APIDayMenuModel> =>
    fetch<APIDayMenuModel>(DAY_API_URL, FetchResultTypes.JSON);

export const isMenuIncomplete = (menu: APIMenuModel) =>
    !menu.mainCourse || menu.mainCourse.length === 0 || !menu.mainCourse[0];

export const addMenusToFields = (
    embed: EmbedBuilder,
    menus: APIMenuModel[],
) => {
    let counter = 0;
    Object.values(menus).forEach((m) => {
        if (isMenuIncomplete(m)) {
            return;
        }

        const title = `\`\`\`Menu ${++counter}\`\`\``;
        embed.addFields({
            name: title,
            value: fieldValueOrEmpty(stripIndent`
                    ${m.starter}
                    ${m.mainCourse.join('\n')}
                    ${m.dessert}
                `),
            inline: true,
        });
    });
};

export const buildWeekMenuEmbed = (menu: APIWeekMenuModel): EmbedBuilder => {
    const embed = new EmbedBuilder()
        .setColor('#EA580C')
        .setTitle(`:fork_and_knife: Menus de la semaine ${menu.week}`)
        .setFooter({
            text: oneLine`
                Semaine
                du ${dayjs(menu.monday).format(DAY_FORMAT)}
                au ${dayjs(menu.friday).format(DAY_FORMAT)}
            `,
        });

    Object.values(menu.days).forEach((dayMenu: APIDayMenuModel) => {
        embed.addFields({
            name: '-'.repeat(80),
            value: oneLineTrim`
                **${capitalize(dayjs(dayMenu.day).format('dddd'))}**
            `,
            inline: false,
        });
        addMenusToFields(embed, dayMenu.menus);
    });

    return embed;
};

export const buildDayMenuEmbed = (menu: APIDayMenuModel): EmbedBuilder => {
    const embed = new EmbedBuilder().setColor('#EA580C').setTitle(
        oneLine`:fork_and_knife: Menus du
                ${dayjs(menu.day).format('dddd LL')}`,
    );
    addMenusToFields(embed, menu.menus);
    return embed;
};

export interface APIWeekMenuModel {
    _id: string;
    week: number;
    year: number;
    monday: string;
    friday: string;
    lastSave: string;
    lastPublish: string;
    days: APIDayMenuModel[];
}

export interface APIDayMenuModel {
    day: string;
    menus: APIMenuModel[];
}

export interface APIMenuModel {
    starter: string;
    mainCourse: string[];
    dessert: string;
    containsPork: boolean;
}
