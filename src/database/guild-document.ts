export interface GuildDocument {
    counters: Record<string, number>;
    quotes: Record<QuoteId, string[]>;
}

export type QuoteId = 'rentsch';
