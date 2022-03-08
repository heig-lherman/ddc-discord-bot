import { Command } from '../framework';

const sentences = [
    '<@493112987415216148> tais toi 😡 !',
    '<@493112987415216148> ferme-la 😡 !',
    '<@493112987415216148> arrête de chanter 😡 !',
    '<@493112987415216148> sors d\'ici 😡 !',
    '<@493112987415216148> il est l\'heure du café ☕ !',
    '<@493112987415216148> elle est où ta sugar-mommy ❤ ?',
    '<@493112987415216148> tu peux chanter une chanson 🥺 ?',
    '<@493112987415216148> on t\'aime 💜💜',
    'Non <@493112987415216148>, le consentement c\'est pas marrant, mais c\'est important.',
    'Non <@493112987415216148>, 0! = 1',
];

export default new Command({
    enabled: true,
    name: 'massimo',
    description: 'Only the truth.',
    async handle({ message }) {
        message.channel.send(sentences[Math.floor(Math.random() * sentences.length)]);
    },
});
