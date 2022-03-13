export interface GuildDocument {
    counters: Record<string, number>;
    homeworks: Homework[];
}

export interface Homework {
    id: string;
    module: string;
    description: string;
    date: string;
}
