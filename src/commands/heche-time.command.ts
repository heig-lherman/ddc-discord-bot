import { TimeCounterCommand } from '#src/commands/support/time-counter-command';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { oneLine } from 'common-tags';
import { EmbedBuilder, Message } from 'discord.js';

@ApplyOptions<TimeCounterCommand.Options>({
    name: 'heche-time',
    aliases: ['jhht', 'hechetime'],
    description: oneLine`
        The break time JHH stole from us. (!jhht help for all commands)
    `,
    counterId: 'hecheTime',
    embedTitle: '⏰ Lost time',
    embedColor: '#71cfcf',
    subcommands: [{ name: 'help', messageRun: 'help' }],
    enabled: true,
})
export default class HecheTimeCommand extends TimeCounterCommand {
    public async help(message: Message) {
        await send(message, {
            embeds: [
                new EmbedBuilder()
                    .setColor('#71cfcf')
                    .setTitle('Time counter commands')
                    .setDescription('Manage the JHH time counter.')
                    .addFields(
                        {
                            name: 'Get the counter',
                            value: '!jhht [get]',
                        },
                        {
                            name: 'Add',
                            value: '!jhht += time',
                        },
                        {
                            name: 'Subtract',
                            value: '!jhht -= time',
                        },
                        {
                            name: 'Set specific',
                            value: '!jhht = amount',
                        },
                    ),
            ],
        });
    }
}
