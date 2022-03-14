export interface GuildDocument {
    counters: Record<CounterId, number>;
    quotes: Record<QuoteId, string[]>;
}

export type CounterId = 'beers';
export type QuoteId = 'rentsch';
