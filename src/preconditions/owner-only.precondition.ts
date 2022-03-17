import { ApplyOptions } from '@sapphire/decorators';
import { Precondition } from '@sapphire/framework';
import type { Snowflake } from 'discord-api-types/globals';
import type { Message } from 'discord.js';

const AUTHOR_ID: Snowflake = '151729036987465728';

@ApplyOptions<Precondition.Options>({
    name: 'OwnerOnly',
})
export default class OwnerOnlyPrecondition extends Precondition {
    public run(message: Message) {
        return message.author.id === AUTHOR_ID
            ? this.ok()
            : this.error({
                  message: 'Only the bot owner can use this command!',
              });
    }
}

declare module '@sapphire/framework' {
    interface Preconditions {
        OwnerOnly: never;
    }
}
