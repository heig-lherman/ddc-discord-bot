import { successEmbed } from '#src/utils/embed-utils';
import { getGuildCollection, getGuildData } from '#src/utils/firestore-utils';
import { ApplyOptions } from '@sapphire/decorators';
import type { Args } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { Subcommand } from '@sapphire/plugin-subcommands';
import dayjs from 'dayjs';
import { Guild, Message, MessageEmbed } from 'discord.js';
import { FieldValue } from 'firebase-admin/firestore';
import ms from 'ms';

const getCounterValue = async (guild: Guild): Promise<string> => {
    const guildData = await getGuildData(guild);
    return dayjs
        .duration(guildData.data()?.counters?.rentschTime ?? 0)
        .format('H[h] m[m]');
};

@ApplyOptions<Subcommand.Options>({
    name: 'rentsch-time',
    aliases: ['rrht', 'rentschtime'],
    description:
        'The break time RRH stole from us. (!rrht help for all commands)',
    subcommands: [
        { name: 'get', messageRun: 'get', default: true },
        { name: '+=', messageRun: 'add' },
        { name: '-=', messageRun: 'subtract' },
        { name: '=', messageRun: 'set' },
        { name: 'help', messageRun: 'help' },
    ],
    enabled: true,
    runIn: 'GUILD_TEXT',
})
export default class RentschTimeCommand extends Subcommand {
    public async get(message: Message) {
        const { logger } = this.container;
        if (!message.guild) {
            logger.error('No guild');
            return;
        }

        await send(message, {
            embeds: [
                new MessageEmbed()
                    .setColor('#71cfcf')
                    .setTitle('⏰ Lost time')
                    .setDescription(
                        `${await getCounterValue(
                            message.guild,
                        )} of time lost :(`,
                    ),
            ],
        });
    }

    public async add(message: Message, args: Args) {
        const { logger } = this.container;
        if (!message.guild) {
            logger.error('No guild');
            return;
        }

        const time = ms(await args.rest('string'));

        const guildDb = await getGuildCollection(message.guild);
        await guildDb.set(
            {
                counters: {
                    rentschTime: FieldValue.increment(
                        time,
                    ) as unknown as number,
                },
            },
            { merge: true },
        );

        await send(message, {
            embeds: [
                successEmbed(
                    `Time updated to: ${await getCounterValue(message.guild)}`,
                ),
            ],
        });
    }

    public async subtract(message: Message, args: Args) {
        const { logger } = this.container;
        if (!message.guild) {
            logger.error('No guild');
            return;
        }

        const time = ms(await args.rest('string'));

        const guildDb = await getGuildCollection(message.guild);
        await guildDb.set(
            {
                counters: {
                    rentschTime: FieldValue.increment(
                        -time,
                    ) as unknown as number,
                },
            },
            { merge: true },
        );

        await send(message, {
            embeds: [
                successEmbed(
                    `Time updated to: ${await getCounterValue(message.guild)}`,
                ),
            ],
        });
    }

    public async set(message: Message, args: Args) {
        const { logger } = this.container;
        if (!message.guild) {
            logger.error('No guild');
            return;
        }

        const time = ms(await args.rest('string'));

        const guildDb = await getGuildCollection(message.guild);
        await guildDb.set({ counters: { rentschTime: time } }, { merge: true });

        await send(message, {
            embeds: [
                successEmbed(
                    `Time updated to: ${await getCounterValue(message.guild)}`,
                ),
            ],
        });
    }

    public async help(message: Message) {
        await send(message, {
            embeds: [
                new MessageEmbed()
                    .setColor('#71cfcf')
                    .setTitle('Time counter commands')
                    .setDescription('Manage the RRH time counter.')
                    .addFields(
                        {
                            name: 'Get the counter',
                            value: '!rrht [get]',
                        },
                        {
                            name: 'Add',
                            value: '!rrht += time',
                        },
                        {
                            name: 'Subtract',
                            value: '!rrht -= time',
                        },
                        {
                            name: 'Set specific',
                            value: '!rrht = amount',
                        },
                    ),
            ],
        });
    }
}
