export interface GuildDocument {
    counters: Record<string, number>;
    homeworks: Homework[];
}

export interface Homework {
    module: string;
    description: string;
    date: string;
}
