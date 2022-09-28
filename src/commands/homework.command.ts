import type { GuildHomework } from '#src/database/guild-homework';
import { errorEmbed, successEmbed } from '#src/utils/embed-utils';
import { converter, getGuildCollection } from '#src/utils/firestore-utils';
import { ApplyOptions } from '@sapphire/decorators';
import type { Args } from '@sapphire/framework';
import { Subcommand } from '@sapphire/plugin-subcommands';
import dayjs from 'dayjs';
import {
    type EmbedFieldData,
    type Guild,
    type Message,
    MessageEmbed,
    type TextChannel,
} from 'discord.js';
import type {
    CollectionReference,
    DocumentSnapshot,
} from 'firebase-admin/firestore';

@ApplyOptions<Subcommand.Options>({
    name: 'homework',
    enabled: true,
    subcommands: [
        { name: 'show', messageRun: 'show', default: true },
        { name: 'show-all', messageRun: 'showAll' },
        { name: 'help', messageRun: 'help' },
        { name: 'add', messageRun: 'add' },
        { name: 'update', messageRun: 'update' },
        { name: 'delete', messageRun: 'delete' },
    ],
    aliases: ['hw'],
    description: 'Manage homeworks. !hw help to show all commands',
    runIn: 'GUILD_TEXT',
})
export default class HomeworkCommand extends Subcommand {
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
                            value: '!hw delete homework-id',
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

        const guildDb = await this.getHomeworkCollection(message.guild);
        const homeworks = await guildDb
            .where('module', '==', message.channelId)
            .orderBy('date', 'asc')
            .get();

        if (homeworks.empty) {
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
                    .addFields(
                        ...(await this.generateEmbedFieldData(homeworks.docs)),
                    ),
            ],
        });
    }

    public async showAll(message: Message) {
        const { logger } = this.container;
        if (!message.guild) {
            logger.error('No guild');
            return;
        }

        const guildDb = await this.getHomeworkCollection(message.guild);
        const homeworks = await guildDb.orderBy('date', 'asc').get();

        if (homeworks.empty) {
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
                    .addFields(
                        ...(await this.generateEmbedFieldData(homeworks.docs)),
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

        const channel = await args.pick('guildTextChannel');
        const dueDate = await args.pick('dayjs');
        const description = await args.rest('string');

        const homework: GuildHomework = {
            module: channel.id,
            description,
            date: dueDate.toISOString(),
        };

        const guildDb = await this.getHomeworkCollection(message.guild);
        const doc = await guildDb.add(homework);

        message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor('#6CC070')
                    .setTitle(`Homework added for ${channel.name}`)
                    .setDescription(`ID: \`${doc.id}\``)
                    .addFields(
                        ...(await this.generateEmbedFieldData([
                            await doc.get(),
                        ])),
                    ),
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

        const guildDb = await this.getHomeworkCollection(message.guild);
        const homeworkRef = guildDb.doc(id);

        try {
            await homeworkRef.update({
                date: dueDate.toISOString(),
                description,
            });

            const homework = await homeworkRef.get();
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('#6CC070')
                        .setTitle(
                            `Homework modified for ${homework.data()?.module}`,
                        )
                        .setDescription(`ID: \`${homeworkRef.id}\``)
                        .addFields(
                            ...(await this.generateEmbedFieldData([homework])),
                        ),
                ],
            });
        } catch (e: unknown) {
            logger.debug('[firestore] update error', e);
            message.channel.send({
                embeds: [errorEmbed(`No homework found with ID ${id}`)],
            });
        }
    }

    public async delete(message: Message, args: Args) {
        const { logger } = this.container;
        if (!message.guild) {
            logger.error('No guild');
            return;
        }

        const id = await args.pick('string');

        const guildDb = await this.getHomeworkCollection(message.guild);
        try {
            await guildDb.doc(id).delete({
                exists: true,
            });

            message.channel.send({
                embeds: [
                    successEmbed(`Homework with ID ${id} has been deleted.`),
                ],
            });
        } catch (e: unknown) {
            logger.debug('[firestore] delete error', e);
            message.channel.send({
                embeds: [errorEmbed(`No homework found with ID ${id}`)],
            });
        }
    }

    private async generateEmbedFieldData(
        hws: DocumentSnapshot<GuildHomework>[],
    ): Promise<EmbedFieldData[]> {
        return Promise.all(
            hws.map(async (hw, i) => {
                const channelId = hw.data()?.module ?? '';
                const channel = (await this.container.client.channels.fetch(
                    channelId,
                )) as TextChannel;

                return {
                    name: `${i + 1}. ${channel.name} - ${
                        hw.data()?.description
                    }`,
                    value: `Due <t:${dayjs(
                        hw.data()?.date,
                    ).unix()}:R> (<t:${dayjs(
                        hw.data()?.date,
                    ).unix()}:F>)\nID: \`${hw.id}\``,
                };
            }),
        );
    }

    private getHomeworkCollection(
        guild: Guild,
    ): Promise<CollectionReference<GuildHomework>> {
        return getGuildCollection(guild).then((c) =>
            c.collection('homeworks').withConverter(converter<GuildHomework>()),
        );
    }
}
