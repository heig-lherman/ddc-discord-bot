import { container } from '@sapphire/framework';
import type { Snowflake } from 'discord.js';
import type { MetaTypeCreator } from 'firelord';
import { getFirelord } from 'firelord';

export type CounterId = 'beers' | 'hecheTime' | 'rentschTime';

export type GuildCounters = { [key in CounterId]: number };
export interface ChannelConfiguration {
    menus?: Snowflake;
    stream?: Snowflake;
}

export type GuildDocument = MetaTypeCreator<
    {
        counters: GuildCounters;
        channels: ChannelConfiguration;
    },
    'guilds',
    Snowflake
>;

export const guildRef = getFirelord<GuildDocument>(
    container.database,
    'guilds',
);
