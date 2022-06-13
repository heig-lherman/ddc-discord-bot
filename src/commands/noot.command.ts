import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import type { Message } from 'discord.js';

const sentences = [
    'ⁿᵒᵒᵗ ⁿᵒᵒᵗ',
    'ɴᴏᴏᴛ ɴᴏᴏᴛ',
    'noot noot',
    'NOOT NOOT',
    'ₙₒₒₜ ₙₒₒₜ',
    'ᴺᴼᴼᵀ ᴺᴼᴼᵀ',
    'NOOT NOOT',
];

@ApplyOptions<Command.Options>({
    name: 'noot',
    description: 'noot noot',
    enabled: true,
})
export default class NootCommand extends Command {
    public override async messageRun(message: Message) {
        await message.channel.send({
            content: sentences[Math.floor(Math.random() * sentences.length)],
        });
    }
}
