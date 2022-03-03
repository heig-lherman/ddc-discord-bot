import { Command } from '../framework';

export default new Command({
  enabled: true,
  name: 'massimo',
  description: 'Only the truth.',
  async handle({ message }) {
    message.channel.send('Massimo tais toi 😡 !');
  },
});
