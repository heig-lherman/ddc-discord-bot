import type { Snowflake } from 'discord-api-types/globals';

export interface GuildHomework {
    module: Snowflake;
    description: string;
    date: string;
}
