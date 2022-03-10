import got from 'got';
import { MessageEmbed, TextChannel } from 'discord.js';
import { Command, sleep } from '../framework';
import Store from '../services/Store';

interface QuoteData {
    type: string;
    time: number;
    duration?: number;
    text?: string;
    image?: string;
}

interface MindfulnessMode {
    data: Array<QuoteData>;
    mp3: string;
}

export default new Command({
    enabled: true,
    name: 'inspirobot',
    alias: ['inspire', 'ib', 'inspiro'],
    description:
        'Get an unique inspirational quote for endless enrichment of pointless human existence.',
    async handle({ message }) {
        const hooks = await (message.channel as TextChannel).fetchWebhooks();
        const inspirobotHook =
            hooks.get('Inspirobot') ??
            (await (message.channel as TextChannel).createWebhook(
                'Inspirobot',
                {
                    avatar: 'https://inspirobot.me/website/images/favicon.png',
                },
            ));

        const { body: url } = await got.get(
            'https://inspirobot.me/api?generate=true',
        );
        const embed = new MessageEmbed()
            .setURL(url)
            .setTitle('InspiroBot says :')
            .setImage(url);

        try {
            inspirobotHook.send(embed).catch(console.error);
        } catch (e) {
            console.error(e);
        }
    },
});
