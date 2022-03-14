import { successEmbed } from '#src/utils/embed-utils';
import { getGuildCollection, getGuildData } from '#src/utils/firestore-utils';
import { ApplyOptions } from '@sapphire/decorators';
import type { Args } from '@sapphire/framework';
import { SubCommandPluginCommand } from '@sapphire/plugin-subcommands';
import { Guild, Message, MessageEmbed } from 'discord.js';
import { FieldValue } from 'firebase-admin/firestore';

const getCounterValue = async (guild: Guild): Promise<number> => {
    const guildData = await getGuildData(guild);
    return guildData.data()?.counters?.beers ?? 0;
};

@ApplyOptions<SubCommandPluginCommand.Options>({
    name: 'beers',
    description: 'Beer counter (!beers help for all commands)',
    subCommands: [
        { input: 'get', default: true },
        { input: '+', output: 'plus' },
        { input: '-', output: 'minus' },
        { input: '=', output: 'set' },
        'help',
    ],
    enabled: true,
    runIn: 'GUILD_TEXT',
})
export default class BeersCommand extends SubCommandPluginCommand {
    public async get(message: Message) {
        const { logger } = this.container;
        if (!message.guild) {
            logger.error('No guild');
            return;
        }

        message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor('#f28e1c')
                    .setTitle('🍻 Beer counter')
                    .setDescription(
                        `Amount: **${await getCounterValue(message.guild)}**`,
                    ),
            ],
        });
    }

    public async plus(message: Message) {
        const { logger } = this.container;
        if (!message.guild) {
            logger.error('No guild');
            return;
        }

        const guildDb = await getGuildCollection(message.guild);
        await guildDb.set(
            {
                counters: {
                    beers: FieldValue.increment(1) as unknown as number,
                },
            },
            { merge: true },
        );

        message.channel.send({
            embeds: [
                successEmbed(
                    `Counter updated, new amount: ${await getCounterValue(
                        message.guild,
                    )}`,
                ),
            ],
        });
    }

    public async minus(message: Message) {
        const { logger } = this.container;
        if (!message.guild) {
            logger.error('No guild');
            return;
        }

        const guildDb = await getGuildCollection(message.guild);
        await guildDb.set(
            {
                counters: {
                    beers: FieldValue.increment(-1) as unknown as number,
                },
            },
            { merge: true },
        );

        message.channel.send({
            embeds: [
                successEmbed(
                    `Counter updated, new amount: ${await getCounterValue(
                        message.guild,
                    )}`,
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

        const amount = await args.pick('number');

        const guildDb = await getGuildCollection(message.guild);
        await guildDb.set({ counters: { beers: amount } }, { merge: true });

        message.channel.send({
            embeds: [successEmbed(`Counter updated, new amount: ${amount}`)],
        });
    }

    public async help(message: Message) {
        message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor('#ffcb87')
                    .setTitle('Counter commands')
                    .setDescription('Manage the beer counter.')
                    .addFields(
                        {
                            name: 'Get the counter',
                            value: '!beers [get]',
                        },
                        {
                            name: 'Increment',
                            value: '!beers +',
                        },
                        {
                            name: 'Decrement',
                            value: '!beers -',
                        },
                        {
                            name: 'Set specific',
                            value: '!beers = amount',
                        },
                    ),
            ],
        });
    }
}
