import { errorEmbed } from '#src/utils/embed-utils';
import { ApplyOptions } from '@sapphire/decorators';
import {
    Listener,
    type MessageCommandDeniedPayload,
} from '@sapphire/framework';

@ApplyOptions<Listener.Options>({
    event: 'messageCommandDenied',
})
export default class CommandDeniedListener extends Listener {
    run(error: Error, { message }: MessageCommandDeniedPayload): unknown {
        return message.reply({
            embeds: [
                errorEmbed(
                    `Unauthorized command access. Reason:\n${error.message}`,
                ),
            ],
        });
    }
}
