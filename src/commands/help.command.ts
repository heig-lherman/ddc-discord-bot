import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import type { APIEmbedField, Message } from 'discord.js';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

@ApplyOptions<Command.Options>({
    name: 'help',
    description: 'Lists all available commands',
    enabled: true,
})
export default class HelpCommand extends Command {
    override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand(
            (builder) => {
                builder.setName(this.name).setDescription(this.description);
            },
            { idHints: ['1081183594808102982'] },
        );
    }

    #getHelpEmbed(): EmbedBuilder {
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

        return new EmbedBuilder()
            .setColor('#2DD4BF')
            .setTitle('All available commands')
            .addFields(...commandFields);
    }

    public override async chatInputRun(
        interaction: ChatInputCommandInteraction,
    ) {
        return interaction.reply({
            embeds: [this.#getHelpEmbed()],
            ephemeral: true,
        });
    }

    public override async messageRun(message: Message) {
        return send(message, {
            embeds: [this.#getHelpEmbed()],
        });
    }
}
