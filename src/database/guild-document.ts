export interface GuildDocument {
    counters: Record<CounterId, number>;
}

export type CounterId = 'beers';
