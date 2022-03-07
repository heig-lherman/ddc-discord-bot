import { Command } from '../framework';

const sentences = [
    'Massimo tais toi 😡 !',
    'Massimo ferme-la 😡 !',
    'Massimo arrête de chanter 😡 !',
    'Massimo sors d\'ici 😡 !',
    'Massimo il est l\'heure du café ☕ !',
    'Massimo elle est où ta sugar-mommy ❤ ?',
    'Massimo tu peux chanter une chanson 🥺 ?',
    'Massimo on t\'aime 💜💜',
    'Non Massimo, le consentement c\'est pas marrant, mais c\'est important.',
    'Non Massimo, 0! = 1',
];

export default new Command({
    enabled: true,
    name: 'massimo',
    description: 'Only the truth.',
    async handle({ message }) {
        message.channel.send(sentences[Math.floor(Math.random() * sentences.length)]);
    },
});
