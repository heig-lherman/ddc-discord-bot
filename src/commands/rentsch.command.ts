import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { type Message, MessageEmbed } from 'discord.js';
import rrhQuotes from '../../data/rrh.json';

@ApplyOptions<Command.Options>({
    name: 'rentsch',
    description: 'Tell a truth about life.',
    aliases: ['rrh'],
    enabled: true,
})
export default class RentschCommand extends Command {
    public override async messageRun(message: Message) {
        const randomIndex = Math.floor(Math.random() * rrhQuotes.length);
        const quote = rrhQuotes[randomIndex];
        const embed = new MessageEmbed()
            .setDescription(quote)
            .setFooter({ text: '© Rentsch' });

        message.channel.send({
            embeds: [embed],
        });
    }
}
