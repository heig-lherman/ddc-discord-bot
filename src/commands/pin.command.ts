import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import type { Message } from 'discord.js';
import { MessageEmbed } from 'discord.js';

@ApplyOptions<Command.Options>({
    name: 'pin',
    description: 'Pin a message by its messageId.',
    enabled: true,
})
export default class PinCommand extends Command {
    public override async messageRun(message: Message, args: Args) {
        const pinMessage = await args.pick('message');

        const { pinned } = pinMessage;
        if (pinned) {
            await pinMessage.unpin();
        } else {
            await pinMessage.pin();
        }

        await message.delete();

        const embed = new MessageEmbed().setColor('#6EE7B7').addFields({
            name: '📌  Pin',
            value: `A [message](${pinMessage.url}) was ${
                pinned ? 'unpinned' : 'pinned'
            } by ${message.author.toString()}.`,
        });

        await send(message, {
            embeds: [embed],
        });
    }
}
