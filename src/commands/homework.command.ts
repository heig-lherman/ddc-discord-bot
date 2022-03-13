import type { Homework } from '#src/database/GuildDocument';
import { errorEmbed, successEmbed } from '#src/utils/embed-utils';
import {
    autoId,
    getGuildCollection,
    getGuildData,
} from '#src/utils/firestore-utils';
import { ApplyOptions } from '@sapphire/decorators';
import type { Args } from '@sapphire/framework';
import { SubCommandPluginCommand } from '@sapphire/plugin-subcommands';
import dayjs from 'dayjs';
import type { EmbedFieldData, Message } from 'discord.js';
import { MessageEmbed, TextChannel } from 'discord.js';

@ApplyOptions<SubCommandPluginCommand.Options>({
    name: 'homework',
    enabled: true,
    subCommands: [
        { input: 'show', default: true },
        { input: 'show-all', output: 'showAll' },
        'help',
        'add',
        'update',
        'delete',
    ],
    aliases: ['hw'],
    description: 'Manage homeworks. !hw help to show all commands',
    runIn: 'GUILD_TEXT',
})
export default class HomeworkCommand extends SubCommandPluginCommand {
    public async help(message: Message) {
        message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor('#fad541')
                    .setTitle('Homework commands')
                    .setDescription(
                        'Manage homeworks for a channel. \n Alias: [hw, homework]',
                    )
                    .addFields(
                        {
                            name: 'Add homework',
                            value: '!hw add #channel dd.mm.yyyy Homework description',
                        },
                        {
                            name: 'Show homeworks (channel bound)',
                            value: '!hw show',
                        },
                        {
                            name: 'Show all homeworks',
                            value: '!hw show-all',
                        },
                        {
                            name: 'Delete homework',
                            value: '!hw delete ID',
                        },
                        {
                            name: 'Update homework',
                            value: '!hw update homework-id dd.mm.yyyy New description',
                        },
                    ),
            ],
        });
    }

    public async show(message: Message) {
        const { logger } = this.container;
        const channelName = (message.channel as TextChannel).name;
        if (!message.guild) {
            logger.error('No guild');
            return;
        }

        const guildDb = await getGuildData(message.guild);
        const homeworks: Homework[] = guildDb.exists
            ? guildDb
                  .data()
                  ?.homeworks.filter((hw) => hw.module === channelName) ?? []
            : [];

        if (!homeworks.length) {
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('#fad541')
                        .setTitle(`No homework for ${channelName}`),
                ],
            });
            return;
        }

        message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor('#fad541')
                    .setTitle(`Homeworks for ${channelName}`)
                    .addFields(...this.generateFieldData(homeworks)),
            ],
        });
    }

    public async showAll(message: Message) {
        const { logger } = this.container;
        if (!message.guild) {
            logger.error('No guild');
            return;
        }

        const guildDb = await getGuildData(message.guild);
        const homeworks: Homework[] = guildDb.exists
            ? guildDb.data()?.homeworks ?? []
            : [];

        if (!homeworks.length) {
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('#fad541')
                        .setTitle(`No homework`),
                ],
            });
            return;
        }

        message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor('#fad541')
                    .setTitle(`Homeworks for all channels`)
                    .addFields(...this.generateFieldData(homeworks)),
            ],
        });
    }

    public async add(message: Message, args: Args) {
        const { logger } = this.container;
        if (!message.guild) {
            logger.error('No guild');
            return;
        }

        const channelName = await args
            .pick('guildTextChannel')
            .then((c) => c.name);
        const dueDate = await args.pick('dayjs');
        const description = await args.rest('string');

        const homework: Homework = {
            id: autoId(),
            module: channelName,
            description,
            date: dueDate.toISOString(),
        };

        const guildDb = await getGuildCollection(message.guild);
        const guildDbData = await guildDb.get();
        const homeworks: Homework[] = guildDbData.exists
            ? guildDbData.data()?.homeworks ?? []
            : [];
        homeworks.push(homework);
        await guildDb.set({ homeworks }, { merge: true });

        message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor('#6CC070')
                    .setTitle(`Homework added for ${channelName}`)
                    .setDescription(`ID: \`${homework.id}\``)
                    .addFields(...this.generateFieldData([homework])),
            ],
        });
    }

    public async update(message: Message, args: Args) {
        const { logger } = this.container;
        if (!message.guild) {
            logger.error('No guild');
            return;
        }

        const id = await args.pick('string');
        const dueDate = await args.pick('dayjs');
        const description = await args.rest('string');

        const guildDb = await getGuildCollection(message.guild);
        const guildDbData = await guildDb.get();
        const homeworks: Homework[] = guildDbData.exists
            ? guildDbData.data()?.homeworks ?? []
            : [];

        const homework = homeworks.find((hw) => hw.id === id);
        if (!homework) {
            message.channel.send({
                embeds: [errorEmbed(`No homework found with ID ${id}`)],
            });
            return;
        }

        homework.date = dueDate?.toISOString() ?? homework.date;
        homework.description = description || homework.description;

        await guildDb.set({ homeworks }, { merge: true });

        message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor('#6CC070')
                    .setTitle(`Homework modified for ${homework.module}`)
                    .setDescription(`ID: \`${homework.id}\``)
                    .addFields(...this.generateFieldData([homework])),
            ],
        });
    }

    public async delete(message: Message, args: Args) {
        const { logger } = this.container;
        if (!message.guild) {
            logger.error('No guild');
            return;
        }

        const id = await args.pick('string');

        const guildDb = await getGuildCollection(message.guild);
        const guildDbData = await guildDb.get();
        const homeworks: Homework[] = guildDbData.exists
            ? guildDbData.data()?.homeworks ?? []
            : [];

        const index = homeworks.findIndex((hw) => hw.id === id);
        if (index < 0) {
            message.channel.send({
                embeds: [errorEmbed(`No homework found with ID ${id}`)],
            });
            return;
        }

        homeworks.splice(index, 1);
        await guildDb.set({ homeworks }, { merge: true });

        message.channel.send({
            embeds: [successEmbed(`Homework with ID ${id} has been deleted.`)],
        });
    }

    private generateFieldData(hws: Homework[]): EmbedFieldData[] {
        return hws
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((hw, i) => {
                return {
                    name: `${i + 1}. ${hw.module} - ${hw.description}`,
                    value: `Due <t:${dayjs(hw.date).unix()}:R> (<t:${dayjs(
                        hw.date,
                    ).unix()}:F>)\nID: \`${hw.id}\``,
                };
            });
    }
}
