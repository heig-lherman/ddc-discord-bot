import { EmbedBuilder } from 'discord.js';

export function errorEmbed(message: string): EmbedBuilder {
    return new EmbedBuilder().setColor('#DC2626').addFields({
        name: '❌  Error',
        value: message,
    });
}

export function successEmbed(message: string): EmbedBuilder {
    return new EmbedBuilder().setColor('#6CC070').addFields({
        name: '✅  Success',
        value: message,
    });
}

export function fieldValueOrEmpty(value: string): string {
    if (!/\S/.test(value)) {
        return '\u200B';
    }

    return value;
}
