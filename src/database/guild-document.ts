export interface GuildDocument {
    counters: Partial<Record<CounterId, number>>;
}

export type CounterId = 'beers' | 'rentschTime';
