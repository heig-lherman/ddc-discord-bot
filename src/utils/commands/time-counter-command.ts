import type { CounterCommandOptions } from './counter-command';
import { CounterCommand } from './counter-command';
import { successEmbed } from '../embed-utils';
import type { Args, Command } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { Subcommand } from '@sapphire/plugin-subcommands';
import dayjs from 'dayjs';
import type { CacheType, Message } from 'discord.js';
import ms from 'ms';

export abstract class TimeCounterCommand<
    PreParseReturn extends Args = Args,
    O extends CounterCommand.Options = CounterCommand.Options,
> extends CounterCommand<PreParseReturn, O> {
    protected constructor(context: Subcommand.LoaderContext, options: O) {
        super(context, {
            ...options,
            subcommands: [
                { name: '+=', messageRun: 'increment' },
                { name: '-=', messageRun: 'decrement' },
                ...(options.subcommands ?? []),
            ],
        });
    }

    protected override formatValue(value: number): string {
        return dayjs.duration(value).format('H[h] m[m]');
    }

    public override async set(message: Message, args: Args) {
        const { logger } = this.container;
        if (!message.guild) {
            logger.error('No guild');
            return;
        }

        const time = ms(await args.rest('string'));
        await this.setValue(message.guild, time);

        await send(message, {
            embeds: [
                successEmbed(
                    `Time updated to: ${await this.getValue(message.guild)}`,
                ),
            ],
        });
    }

    public override async increment(message: Message, args: Args) {
        const { logger } = this.container;
        if (!message.guild) {
            logger.error('No guild');
            return;
        }

        const time = ms(await args.rest('string'));
        await this.incrementValue(message.guild, time);

        await send(message, {
            embeds: [
                successEmbed(
                    `Time updated to: ${await this.getValue(message.guild)}`,
                ),
            ],
        });
    }

    public override async decrement(message: Message, args: Args) {
        const { logger } = this.container;
        if (!message.guild) {
            logger.error('No guild');
            return;
        }

        const time = ms(await args.rest('string'));
        await this.incrementValue(message.guild, -time);

        await send(message, {
            embeds: [
                successEmbed(
                    `Time updated to: ${await this.getValue(message.guild)}`,
                ),
            ],
        });
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace TimeCounterCommand {
    export type Options = CounterCommandOptions;
    export type JSON = Command.JSON;
    export type Context = Command.Context;
    export type RunInTypes = Command.RunInTypes;
    export type ChatInputCommandInteraction<
        Cached extends CacheType = CacheType,
    > = Command.ChatInputCommandInteraction<Cached>;
    export type ContextMenuCommandInteraction<
        Cached extends CacheType = CacheType,
    > = Command.ContextMenuCommandInteraction<Cached>;
    export type AutocompleteInteraction<Cached extends CacheType = CacheType> =
        Command.AutocompleteInteraction<Cached>;
    export type Registry = Command.Registry;
}
