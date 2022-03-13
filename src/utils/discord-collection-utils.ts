import { Guild, TextChannel } from 'discord.js';

export const findChannelByName = (
    guild: Guild,
    name: string,
): TextChannel | undefined => {
    return guild.channels.cache.find(
        (channel) => channel instanceof TextChannel && channel.name === name,
    ) as TextChannel | undefined;
};
