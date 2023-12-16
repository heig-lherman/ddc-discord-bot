import { TimeCounterCommand } from '../utils/commands/time-counter-command';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { oneLine } from 'common-tags';
import { EmbedBuilder, Message } from 'discord.js';

@ApplyOptions<TimeCounterCommand.Options>({
    name: 'rentsch-time',
    aliases: ['rrht', 'rentschtime'],
    description: oneLine`
        The break time RRH stole from us. (!rrht help for all commands)
    `,
    counterId: 'rentschTime',
    embedTitle: '⏰ Lost time with RRH',
    embedColor: '#71cfcf',
    subcommands: [{ name: 'help', messageRun: 'help' }],
    enabled: true,
})
export default class RentschTimeCommand extends TimeCounterCommand {
    public async help(message: Message) {
        await send(message, {
            embeds: [
                new EmbedBuilder()
                    .setColor('#71cfcf')
                    .setTitle('Time counter commands')
                    .setDescription('Manage the RRH time counter.')
                    .addFields(
                        {
                            name: 'Get the counter',
                            value: '!rrht [get]',
                        },
                        {
                            name: 'Add',
                            value: '!rrht += time',
                        },
                        {
                            name: 'Subtract',
                            value: '!rrht -= time',
                        },
                        {
                            name: 'Set specific',
                            value: '!rrht = amount',
                        },
                    ),
            ],
        });
    }
}
