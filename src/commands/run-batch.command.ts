import { errorEmbed, successEmbed } from '../utils/embed-utils';
import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import { reply } from '@sapphire/plugin-editable-commands';
import type { Message } from 'discord.js';

@ApplyOptions<Command.Options>({
    name: 'batch',
    description: 'Run a batch',
    enabled: true,
    preconditions: ['OwnerOnly'],
})
export default class RunBatchCommand extends Command {
    public override async messageRun(message: Message, args: Args) {
        const batchIdentifier = await args.pick('string');
        const tasks = this.container.stores.get('scheduled-tasks');

        const batch = tasks.get(batchIdentifier);
        if (!batch) {
            await reply(message, {
                embeds: [errorEmbed('Unknown batch.')],
            });
            return;
        }

        batch.run({});
        await reply(message, {
            embeds: [successEmbed('Done.')],
        });
    }
}
