import { CounterCommand } from '#src/commands/support/counter-command';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { EmbedBuilder, Message } from 'discord.js';

@ApplyOptions<CounterCommand.Options>({
    name: 'beers',
    description: 'Beer counter (!beers help for all commands)',
    counterId: 'beers',
    embedTitle: '🍻 Beer counter',
    embedColor: '#f28e1c',
    subcommands: [
        { name: '++', messageRun: 'increment' },
        { name: '--', messageRun: 'decrement' },
        { name: 'help', messageRun: 'help' },
    ],
    enabled: true,
})
export default class BeersCommand extends CounterCommand {
    public async help(message: Message) {
        await send(message, {
            embeds: [
                new EmbedBuilder()
                    .setColor('#ffcb87')
                    .setTitle('Counter commands')
                    .setDescription(`Manage the beers counter.`)
                    .addFields(
                        {
                            name: 'Get the counter',
                            value: `!beers [get]`,
                        },
                        {
                            name: 'Increment',
                            value: `!beers ++`,
                        },
                        {
                            name: 'Decrement',
                            value: `!beers --`,
                        },
                        {
                            name: 'Set specific',
                            value: `!beers = amount`,
                        },
                    ),
            ],
        });
    }
}
