import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import type { APIEmbedField, Message } from 'discord.js';
import { EmbedBuilder } from 'discord.js';

@ApplyOptions<Command.Options>({
    name: 'help',
    description: 'Lists all available commands',
    enabled: true,
})
export default class HelpCommand extends Command {
    public override async messageRun(message: Message) {
        const commandFields: APIEmbedField[] = [];
        this.container.client.stores
            .get('commands')
            .filter((c) => c.name !== 'help')
            .forEach((command) => {
                const description = command.aliases.length
                    ? `[*${command.aliases.join(', ')}*]
                       ${command.description}`
                    : command.description;
                commandFields.push({
                    name: command.name,
                    value: description,
                    inline: false,
                });
            });

        const embed = new EmbedBuilder()
            .setColor('#2DD4BF')
            .setTitle('All available commands')
            .addFields(...commandFields);

        return send(message, {
            embeds: [embed],
        });
    }
}
