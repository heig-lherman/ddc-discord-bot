import { shuffleArray } from '#src/utils/array-utils';
import { errorEmbed } from '#src/utils/embed-utils';
import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import dayjs from 'dayjs';
import type { Message } from 'discord.js';
import { MessageEmbed } from 'discord.js';

@ApplyOptions<Command.Options>({
    name: 'groups',
    aliases: ['group'],
    description: 'Create random groups from a list of names.',
})
export default class GroupsCommand extends Command {
    public override async messageRun(message: Message, args: Args) {
        const names = await args.repeat('string');
        const groupSize = parseInt(names.pop() ?? '0', 10);

        if (names.length < groupSize || groupSize <= 0) {
            message.channel.send({
                embeds: [
                    errorEmbed(
                        `Size is invalid you dumbo: [1, ${names.length}]`,
                    ),
                ],
            });
            return;
        }

        const embed = new MessageEmbed()
            .setColor('#EA580C')
            .setTitle('🎡 **Random Groups** 🎡');
        shuffleArray(names);
        const description: string[] = [];

        let i = 0;
        let group = 0;
        names.forEach((name) => {
            if (i++ % groupSize === 0) {
                description.push(`\n**Group ${++group}**`);
            }
            description.push(name);
        });

        embed.setDescription(description.join('\n'));
        const timeNow = dayjs().locale('fr-ch').local().format('HH:mm:ss');
        embed.setFooter({
            text: `Groups created randomly at ${timeNow}.`,
        });

        message.channel.send({
            embeds: [embed],
        });
    }
}
