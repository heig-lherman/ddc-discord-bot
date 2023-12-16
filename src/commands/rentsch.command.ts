import { Quote, QuoteDocument, quoteRef } from '../database/guild-quote';
import { getRandomDocument } from '../utils/database-utils';
import { errorEmbed, successEmbed } from '../utils/embed-utils';
import { ApplyOptions } from '@sapphire/decorators';
import {
    fetch,
    FetchMediaContentTypes,
    FetchResultTypes,
} from '@sapphire/fetch';
import type { Args } from '@sapphire/framework';
import { reply, send } from '@sapphire/plugin-editable-commands';
import { Subcommand } from '@sapphire/plugin-subcommands';
import { EmbedBuilder, type Guild, type Message } from 'discord.js';
import type { CollectionReference, DocumentReference } from 'firelord';
import { addDoc, deleteDoc, getDocs, updateDoc } from 'firelord';

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
    #getCollection(guild: Guild): CollectionReference<QuoteDocument> {
        return quoteRef.collection(guild.id);
    }

    #getDocument(guild: Guild, doc: string): DocumentReference<QuoteDocument> {
        return quoteRef.doc(guild.id, doc);
    }

    public async get(message: Message) {
        const { logger } = this.container;
        if (!message.guild) {
            logger.error('No guild');
            return;
        }

        const quoteDoc = await getRandomDocument(
            this.#getCollection(message.guild),
        );
        if (!quoteDoc) {
            await reply(message, {
                embeds: [errorEmbed('No quotes found')],
            });

            return;
        }

        const embed = new EmbedBuilder()
            .setDescription(quoteDoc.data().content)
            .setFooter({ text: `© Rentsch - ID: ${quoteDoc.id}` });

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
        const quote: Quote = { category: 'rentsch', content };

        const doc = await addDoc(this.#getCollection(message.guild), quote);
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

        try {
            await updateDoc(this.#getDocument(message.guild, id), {
                content,
            });

            await send(message, {
                embeds: [successEmbed(`Quote ${id} successfully edited.`)],
            });
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

        try {
            await deleteDoc(this.#getDocument(message.guild, id));
            await send(message, {
                embeds: [successEmbed(`Quote ${id} successfully deleted.`)],
            });
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

        await Promise.all(
            message.attachments
                .filter(
                    (a) =>
                        a.contentType?.startsWith(
                            FetchMediaContentTypes.JSON,
                        ) ?? false,
                )
                .map(({ url }) => fetch<string[]>(url, FetchResultTypes.JSON)),
        ).then((allQuotes) =>
            Promise.all(
                allQuotes.flatMap((quoteFile) =>
                    quoteFile.map((content) =>
                        addDoc(this.#getCollection(message.guild!), {
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

        const quotes = await getDocs(this.#getCollection(message.guild));
        await send(message, {
            content: '✅  Export successful',
            files: [
                {
                    attachment: Buffer.from(
                        JSON.stringify(
                            quotes.docs.map((d) => d.data().content),
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
                new EmbedBuilder()
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
