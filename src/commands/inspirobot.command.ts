import { ApplyOptions } from '@sapphire/decorators';
import { fetch, FetchResultTypes } from '@sapphire/fetch';
import { Command } from '@sapphire/framework';
import { type Message, MessageEmbed, type TextChannel } from 'discord.js';

@ApplyOptions<Command.Options>({
    description:
        'Get an unique inspirational quote for endless enrichment of pointless human existence.',
    name: 'inspirobot',
    aliases: ['inspire', 'ib', 'inspiro'],
    enabled: true,
})
export default class InspirobotCommand extends Command {
    public override async messageRun(message: Message) {
        const hooks = await (message.channel as TextChannel).fetchWebhooks();
        const inspirobotHook =
            hooks.find((wh) => wh.name === 'Inspirobot') ??
            (await (message.channel as TextChannel).createWebhook(
                'Inspirobot',
                {
                    avatar: 'https://inspirobot.me/website/images/favicon.png',
                },
            ));

        const url = await fetch(
            'https://inspirobot.me/api?generate=true',
            FetchResultTypes.Text,
        );
        const embed = new MessageEmbed()
            .setURL(url)
            .setTitle('InspiroBot says :')
            .setImage(url);

        inspirobotHook
            .send({
                embeds: [embed],
            })
            .catch(this.container.logger.error);
    }
}
