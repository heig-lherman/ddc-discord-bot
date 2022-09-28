import { Config } from '#src/Config';
import { ApplyOptions } from '@sapphire/decorators';
import { AllFlowsPrecondition, Precondition } from '@sapphire/framework';
import type {
    CommandInteraction,
    ContextMenuInteraction,
    Message,
} from 'discord.js';

export enum OwnerOnlyIdentifiers {
    PreconditionOwnerOnly = 'preconditionOwnerOnly',
}

@ApplyOptions<Precondition.Options>({
    name: 'OwnerOnly',
})
export default class OwnerOnlyPrecondition extends AllFlowsPrecondition {
    public override messageRun(message: Message): AllFlowsPrecondition.Result {
        return this.checkOwner(message.author.id);
    }

    public override chatInputRun(
        interaction: CommandInteraction,
    ): AllFlowsPrecondition.Result {
        return this.checkOwner(interaction.user.id);
    }

    public override contextMenuRun(
        interaction: ContextMenuInteraction,
    ): AllFlowsPrecondition.Result {
        return this.checkOwner(interaction.user.id);
    }

    private checkOwner(userId: string) {
        return Config.bot.owners.includes(userId)
            ? this.ok()
            : this.error({
                  identifier: OwnerOnlyIdentifiers.PreconditionOwnerOnly,
                  message: 'Only the bot owner can use this command!',
              });
    }
}

declare module '@sapphire/framework' {
    interface Preconditions {
        OwnerOnly: never;
    }
}
