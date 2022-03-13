import { errorEmbed } from '#src/utils/embed-utils';
import { ApplyOptions } from '@sapphire/decorators';
import { CommandErrorPayload, Listener } from '@sapphire/framework';

@ApplyOptions<Listener.Options>({
    event: 'commandError',
})
export default class CommandErrorListener extends Listener {
    run(error: Error, { message }: CommandErrorPayload): unknown {
        return message.reply({
            embeds: [
                errorEmbed(
                    `An unknown error prevented this command from executing. Message:\n${error.message}`,
                ),
            ],
        });
    }
}
