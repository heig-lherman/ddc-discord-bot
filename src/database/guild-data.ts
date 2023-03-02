import { container } from '@sapphire/framework';
import type { Snowflake } from 'discord.js';
import type { MetaTypeCreator } from 'firelord';
import { getFirelord } from 'firelord';

export type CounterId = 'beers' | 'rentschTime';

export type GuildCounters = { [key in CounterId]: number };
export type GuildDocument = MetaTypeCreator<
    { counters: GuildCounters },
    'guilds',
    Snowflake
>;

export const guildRef = getFirelord<GuildDocument>(
    container.database,
    'guilds',
);
