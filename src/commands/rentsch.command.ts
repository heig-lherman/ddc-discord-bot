import type { GuildDocument } from '#src/database/guild-document';
import { errorEmbed, successEmbed } from '#src/utils/embed-utils';
import { getGuildCollection, getGuildData } from '#src/utils/firestore-utils';
import { ApplyOptions } from '@sapphire/decorators';
import {
    fetch,
    FetchMediaContentTypes,
    FetchResultTypes,
} from '@sapphire/fetch';
import type { Args } from '@sapphire/framework';
import { SubCommandPluginCommand } from '@sapphire/plugin-subcommands';
import { type Message, MessageEmbed } from 'discord.js';

@ApplyOptions<SubCommandPluginCommand.Options>({
    name: 'rentsch',
    description: 'Tell a truth about life. (!rrh help for all commands)',
    aliases: ['rrh'],
    subCommands: [
        { input: 'get', default: true },
        'add',
        'edit',
        'remove',
        'help',
        'import',
        'export',
    ],
    enabled: true,
    runIn: 'GUILD_TEXT',
})
export default class RentschCommand extends SubCommandPluginCommand {
    public async get(message: Message) {
        const { logger } = this.container;
        if (!message.guild) {
            logger.error('No guild');
            return;
        }

        const guildData = await getGuildData(message.guild);
        const rrhQuotes = guildData.data()?.quotes?.rentsch ?? [];

        const randomIndex = Math.floor(Math.random() * rrhQuotes.length);
        const quote = rrhQuotes[randomIndex];
        const embed = new MessageEmbed()
            .setDescription(quote)
            .setFooter({ text: `© Rentsch - ID: ${randomIndex}` });

        message.channel.send({
            embeds: [embed],
        });
    }

    public async add(message: Message, args: Args) {
        const { logger } = this.container;
        if (!message.guild) {
            logger.error('No guild');
            return;
        }

        const content = await args.rest('string');

        const guildDb = await getGuildCollection(message.guild);
        const guildDbData = await guildDb.get();

        const quotes: GuildDocument['quotes'] = {
            rentsch: [...(guildDbData.data()?.quotes?.rentsch ?? []), content],
        };
        await guildDb.set({ quotes }, { merge: true });

        message.channel.send({
            embeds: [
                successEmbed(
                    `Quote successfully added.\nID: ${
                        quotes.rentsch.length - 1
                    }`,
                ),
            ],
        });
    }

    public async edit(message: Message, args: Args) {
        const { logger } = this.container;
        if (!message.guild) {
            logger.error('No guild');
            return;
        }

        const id = await args.pick('number');
        const content = await args.rest('string');

        const guildDb = await getGuildCollection(message.guild);
        const guildDbData = await guildDb.get();
        const rrhQuotes = guildDbData.data()?.quotes?.rentsch ?? [];

        if (!rrhQuotes[id]) {
            message.channel.send({
                embeds: [errorEmbed('Unknown quote ID.')],
            });
            return;
        }

        rrhQuotes[id] = content;
        const quotes: GuildDocument['quotes'] = {
            rentsch: rrhQuotes,
        };
        await guildDb.set({ quotes }, { merge: true });

        message.channel.send({
            embeds: [successEmbed(`Quote #${id} successfully edited.`)],
        });
    }

    public async delete(message: Message, args: Args) {
        const { logger } = this.container;
        if (!message.guild) {
            logger.error('No guild');
            return;
        }

        const id = await args.pick('number');

        const guildDb = await getGuildCollection(message.guild);
        const guildDbData = await guildDb.get();
        const rrhQuotes = guildDbData.data()?.quotes?.rentsch ?? [];

        if (!rrhQuotes[id]) {
            message.channel.send({
                embeds: [errorEmbed('Unknown quote ID.')],
            });
            return;
        }

        rrhQuotes.splice(id, 1);
        const quotes: GuildDocument['quotes'] = {
            rentsch: rrhQuotes,
        };
        await guildDb.set({ quotes }, { merge: true });

        message.channel.send({
            embeds: [successEmbed(`Quote #${id} successfully deleted.`)],
        });
    }

    public async import(message: Message) {
        const { logger } = this.container;
        if (!message.guild) {
            logger.error('No guild');
            return;
        }

        if (message.author.id !== '151729036987465728') {
            await message.reply({
                embeds: [errorEmbed('Unauthorized.')],
            });
            return;
        }

        const guildDb = await getGuildCollection(message.guild);
        const guildDbData = await guildDb.get();

        const quotes: GuildDocument['quotes'] = {
            rentsch: guildDbData.data()?.quotes?.rentsch ?? [],
        };

        await Promise.all(
            message.attachments
                .filter(
                    (a) =>
                        a.contentType?.startsWith(
                            FetchMediaContentTypes.JSON,
                        ) ?? false,
                )
                .map(({ attachment }) =>
                    fetch<string[]>(
                        attachment as string,
                        FetchResultTypes.JSON,
                    ),
                ),
        ).then((allQuotes) =>
            allQuotes.forEach((quoteFile) => quotes.rentsch.push(...quoteFile)),
        );

        await guildDb.set({ quotes }, { merge: true });
        message.channel.send({
            embeds: [successEmbed('Import successful.')],
        });
    }

    public async export(message: Message) {
        const { logger } = this.container;
        if (!message.guild) {
            logger.error('No guild');
            return;
        }

        const guildDb = await getGuildCollection(message.guild);
        const guildDbData = await guildDb.get();

        const quotes: GuildDocument['quotes'] = {
            rentsch: guildDbData.data()?.quotes?.rentsch ?? [],
        };

        message.channel.send({
            content: '✅  Export successful',
            files: [
                {
                    attachment: Buffer.from(
                        JSON.stringify(quotes.rentsch, null, 2),
                        'utf-8',
                    ),
                    name: 'rrh.json',
                },
            ],
        });
    }

    public async help(message: Message) {
        message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor('#725fde')
                    .setTitle('Quote commands')
                    .setDescription(
                        'Manage quotes from RRH. \n Alias: [rrh, rentsch]',
                    )
                    .addFields(
                        {
                            name: 'Random quote',
                            value: '!rrh [get]',
                        },
                        {
                            name: 'Add quote',
                            value: '!rrh add Quote string',
                        },
                        {
                            name: 'Edit quote',
                            value: '!rrh edit quote-id Quote string',
                        },
                        {
                            name: 'Delete quote',
                            value: '!rrh delete quote-id',
                        },
                    ),
            ],
        });
    }
}
