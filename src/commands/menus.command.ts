import {
    buildDayMenuEmbed,
    buildWeekMenuEmbed,
    queryDayMenu,
    queryWeekMenu,
} from '#src/services/heig-canteen-menu.service';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Args, Command } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import type {
    ChatInputCommandInteraction,
    EmbedBuilder,
    Message,
} from 'discord.js';

@ApplyOptions<Command.Options>({
    name: 'menus',
    description: 'Display the menus of the week at the HEIG-VD',
    enabled: true,
    flags: ['today'],
})
export default class MenusCommand extends Command {
    override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand(
            (builder) =>
                builder
                    .setName(this.name)
                    .setDescription(this.description)
                    .addBooleanOption((option) =>
                        option
                            .setName('today')
                            .setDescription("Only display today's menu")
                            .setRequired(false),
                    ),
            { idHints: ['1078650858973175838'] },
        );
    }

    public override async chatInputRun(
        interaction: ChatInputCommandInteraction,
    ) {
        if (interaction.options.getBoolean('today', false) ?? false) {
            return interaction.reply({
                embeds: [await this.getDayEmbed()],
            });
        }

        return interaction.reply({
            embeds: [await this.getWeekEmbed()],
        });
    }

    public override async messageRun(message: Message, args: Args) {
        const showToday = args.getFlags('today');

        if (showToday) {
            return send(message, {
                embeds: [await this.getDayEmbed()],
            });
        }

        return send(message, {
            embeds: [await this.getWeekEmbed()],
        });
    }

    private async getWeekEmbed(): Promise<EmbedBuilder> {
        const menu = await queryWeekMenu();
        return buildWeekMenuEmbed(menu);
    }

    private async getDayEmbed(): Promise<EmbedBuilder> {
        const menu = await queryDayMenu();
        return buildDayMenuEmbed(menu);
    }
}
