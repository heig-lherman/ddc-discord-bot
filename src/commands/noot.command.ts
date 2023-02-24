import { ApplyOptions } from '@sapphire/decorators';
import { type ApplicationCommandRegistry, Command } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { oneLineTrim } from 'common-tags';
import type {
    BaseMessageOptions,
    ChatInputCommandInteraction,
    Message,
} from 'discord.js';

const baseUrl = 'https://giphy.com/embed/';
const images = [
    'iDPv54rvXkkA8',
    'XHQw4TNhd8RRC',
    'sy23M3VeBGkvK',
    'psv1zrhPZM6WI',
    'gfJtgKZrBfXP2',
    'pKZvvnJoFUh8Y',
    '81cBoGwKePvck',
    'eNq8xHnkD6mnLTqTws',
    'QBC5foQmcOkdq',
];

const buildRandomMessage = (): BaseMessageOptions => ({
    content: oneLineTrim`
        ${baseUrl}
        ${images[Math.floor(Math.random() * images.length)]}
    `,
});
@ApplyOptions<Command.Options>({
    name: 'noot',
    description: 'noot noot',
    enabled: true,
})
export default class NootCommand extends Command {
    override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand(
            (builder) =>
                builder.setName(this.name).setDescription(this.description),
            { idHints: ['1078596618091245578'] },
        );
    }

    public override chatInputRun(interaction: ChatInputCommandInteraction) {
        return interaction.reply(buildRandomMessage());
    }

    public override messageRun(message: Message) {
        return send(message, buildRandomMessage());
    }
}
