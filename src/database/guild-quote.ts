import type { GuildDocument } from '#src/database/guild-data';
import { container } from '@sapphire/framework';
import type { MetaTypeCreator } from 'firelord';
import { getFirelord } from 'firelord';

export type QuoteCategory = 'rentsch';
export type Quote = {
    category: QuoteCategory;
    content: string;
};

export type QuoteDocument = MetaTypeCreator<
    Quote,
    'quotes',
    string,
    GuildDocument
>;

export const quoteRef = getFirelord<QuoteDocument>(
    container.database,
    'guilds',
    'quotes',
);
