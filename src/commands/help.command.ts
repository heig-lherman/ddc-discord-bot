import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import type { EmbedFieldData, Message } from 'discord.js';
import { MessageEmbed } from 'discord.js';

@ApplyOptions<Command.Options>({
    name: 'help',
    description: 'Lists all available commands',
    enabled: true,
})
export default class HelpCommand extends Command {
    public override async messageRun(message: Message) {
        const commandFields: EmbedFieldData[] = [];
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

        const embed = new MessageEmbed()
            .setColor('#2DD4BF')
            .setTitle('All available commands')
            .addFields(...commandFields);

        message.channel.send({
            embeds: [embed],
        });
    }
}
