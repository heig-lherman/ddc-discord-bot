import { GiphyFetch } from '@giphy/js-fetch-api';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
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

const gf = new GiphyFetch(process.env.GIPHY_API_KEY ?? 'unknown');

const sendRandom = async (message: Message) => {
    return send(message, {
        content: sentences[Math.floor(Math.random() * sentences.length)],
    });
};

@ApplyOptions<Command.Options>({
    name: 'noot',
    description: 'noot noot',
    enabled: true,
})
export default class NootCommand extends Command {
    public override async messageRun(message: Message) {
        if (Math.random() > 0.6) {
            return sendRandom(message);
        }

        const res = await gf.random({
            tag: 'pingu noot noot',
            limit: 1,
            rating: 'pg-13',
        });

        return send(message, {
            content: res.data.embed_url,
        });
    }
}
