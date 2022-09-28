import type { GuildQuote } from '#src/database/guild-quote';
import { errorEmbed, successEmbed } from '#src/utils/embed-utils';
import { converter, getGuildCollection } from '#src/utils/firestore-utils';
import { ApplyOptions } from '@sapphire/decorators';
import {
    fetch,
    FetchMediaContentTypes,
    FetchResultTypes,
} from '@sapphire/fetch';
import type { Args } from '@sapphire/framework';
import { reply, send } from '@sapphire/plugin-editable-commands';
import { Subcommand } from '@sapphire/plugin-subcommands';
import { Guild, type Message, MessageEmbed } from 'discord.js';
import {
    type CollectionReference,
    FieldPath,
    type Query,
} from 'firebase-admin/firestore';

@ApplyOptions<Subcommand.Options>({
    name: 'rentsch',
    description: 'Tell a truth about life. (!rrh help for all commands)',
    aliases: ['rrh'],
    subcommands: [
        { name: 'get', messageRun: 'get', default: true },
        { name: 'add', messageRun: 'add' },
        { name: 'edit', messageRun: 'edit' },
        { name: 'delete', messageRun: 'delete' },
        { name: 'help', messageRun: 'help' },
        { name: 'import', messageRun: 'import' },
        { name: 'export', messageRun: 'export' },
    ],
    enabled: true,
    runIn: 'GUILD_TEXT',
})
export default class RentschCommand extends Subcommand {
    public async get(message: Message) {
        const { logger } = this.container;
        if (!message.guild) {
            logger.error('No guild');
            return;
        }

        const quotesQuery = await this.getQuotesQuery(message.guild);
        const size = await quotesQuery
            .select(FieldPath.documentId())
            .get()
            .then((c) => c.docs.length);

        const randomIndex = Math.floor(Math.random() * size);
        const quote = await quotesQuery.offset(randomIndex).limit(1).get();

        if (quote.empty) {
            await send(message, {
                embeds: [errorEmbed('There are no quotes')],
            });
            return;
        }

        const embed = new MessageEmbed()
            .setDescription(quote.docs[0].data().content)
            .setFooter({ text: `© Rentsch - ID: ${quote.docs[0].id}` });

        await send(message, {
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

        const quote: GuildQuote = { category: 'rentsch', content };

        const quotesDb = await this.getQuotesCollection(message.guild);
        const doc = await quotesDb.add(quote);

        await send(message, {
            embeds: [successEmbed(`Quote successfully added.\nID: ${doc.id}`)],
        });
    }

    public async edit(message: Message, args: Args) {
        const { logger } = this.container;
        if (!message.guild) {
            logger.error('No guild');
            return;
        }

        const id = await args.pick('string');
        const content = await args.rest('string');

        const quotesDb = await this.getQuotesQuery(message.guild);
        const quoteQueryRef = quotesDb.where(FieldPath.documentId(), '==', id);

        try {
            const quoteQuery = await quoteQueryRef.get();
            if (quoteQuery.empty || !quoteQuery.docs[0].exists) {
                await send(message, {
                    embeds: [errorEmbed(`No quote found with ID ${id}`)],
                });
                return;
            }

            const quote = quoteQuery.docs[0];
            await quote.ref.update({
                content,
            });

            await send(message, {
                embeds: [
                    successEmbed(`Quote ${quote.id} successfully edited.`),
                ],
            });

            return;
        } catch (e: unknown) {
            logger.debug('[firestore] update error', e);
            await send(message, {
                embeds: [errorEmbed(`No quote found with ID ${id}`)],
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

        const quotesDb = await this.getQuotesQuery(message.guild);
        const quoteQueryRef = quotesDb.where(FieldPath.documentId(), '==', id);

        try {
            const quoteQuery = await quoteQueryRef.get();
            if (quoteQuery.empty || !quoteQuery.docs[0].exists) {
                await send(message, {
                    embeds: [errorEmbed(`No quote found with ID ${id}`)],
                });
                return;
            }

            const quote = quoteQuery.docs[0];
            await quote.ref.delete({
                exists: true,
            });

            await send(message, {
                embeds: [
                    successEmbed(`Quote ${quote.id} successfully deleted.`),
                ],
            });

            return;
        } catch (e: unknown) {
            logger.debug('[firestore] update error', e);
            await send(message, {
                embeds: [errorEmbed(`No quote found with ID ${id}`)],
            });
        }
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

        const guildDb = await this.getQuotesCollection(message.guild);
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
            Promise.all(
                allQuotes.flatMap((quoteFile) =>
                    quoteFile.map((content) =>
                        guildDb.doc().set({
                            category: 'rentsch',
                            content,
                        }),
                    ),
                ),
            ),
        );

        await send(message, {
            embeds: [successEmbed('Import successful.')],
        });
    }

    public async export(message: Message) {
        const { logger } = this.container;
        if (!message.guild) {
            logger.error('No guild');
            return;
        }

        const quotesQueryRef = await this.getQuotesQuery(message.guild);
        const quotesQuery = await quotesQueryRef.get();

        await send(message, {
            content: '✅  Export successful',
            files: [
                {
                    attachment: Buffer.from(
                        JSON.stringify(
                            quotesQuery.docs.map((d) => d.data().content),
                            null,
                            2,
                        ),
                        'utf-8',
                    ),
                    name: 'rrh.json',
                },
            ],
        });
    }

    public async help(message: Message) {
        await reply(message, {
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

    private getQuotesCollection(
        guild: Guild,
    ): Promise<CollectionReference<GuildQuote>> {
        return getGuildCollection(guild).then((c) =>
            c.collection('quotes').withConverter(converter<GuildQuote>()),
        );
    }

    private getQuotesQuery(guild: Guild): Promise<Query<GuildQuote>> {
        return this.getQuotesCollection(guild).then((qc) =>
            qc.where('category', '==', 'rentsch'),
        );
    }
}
