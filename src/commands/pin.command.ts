import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command } from '@sapphire/framework';
import {
    ApplicationCommandType,
    type ContextMenuCommandInteraction,
    EmbedBuilder,
} from 'discord.js';

@ApplyOptions<Command.Options>({
    name: 'pin',
    description: 'Pin/Unpin',
    enabled: true,
})
export default class PinCommand extends Command {
    override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerContextMenuCommand(
            (builder) =>
                builder
                    .setName(this.description)
                    .setType(ApplicationCommandType.Message),
            { idHints: ['1078596616296071228'] },
        );
    }

    public override async contextMenuRun(
        interaction: ContextMenuCommandInteraction,
    ) {
        if (!interaction.isMessageContextMenuCommand()) {
            return null;
        }

        const message = interaction.targetMessage;
        const { pinned } = message;
        if (pinned) {
            await message.unpin();
        } else {
            await message.pin();
        }

        const embed = new EmbedBuilder().setColor('#6EE7B7').addFields({
            name: '📌  Pin',
            value: `The [message](${message.url}) has been ${
                pinned ? 'unpinned' : 'pinned'
            }.`,
        });

        return interaction.reply({
            embeds: [embed],
            ephemeral: true,
        });
    }
}
