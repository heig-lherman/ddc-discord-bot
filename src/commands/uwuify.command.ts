import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import type { Message } from 'discord.js';
import Uwuifier from 'uwuifier';

const uwuifier = new Uwuifier();

@ApplyOptions<Command.Options>({
    name: 'uwuify',
    description: 'This does what you think it does.',
    enabled: true,
})
export default class UwuifyCommand extends Command {
    public override async messageRun(message: Message, args: Args) {
        const srcContent = await args.rest('string');
        return send(message, {
            content: uwuifier.uwuifySentence(srcContent),
        });
    }
}
