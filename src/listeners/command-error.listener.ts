import { errorEmbed } from '#src/utils/embed-utils';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, type MessageCommandErrorPayload } from '@sapphire/framework';

@ApplyOptions<Listener.Options>({
    event: 'messageCommandError',
})
export default class CommandErrorListener extends Listener {
    run(error: Error, { message }: MessageCommandErrorPayload): unknown {
        return message.reply({
            embeds: [
                errorEmbed(
                    `An unknown error prevented this command from executing. Message:\n${error.message}`,
                ),
            ],
        });
    }
}
