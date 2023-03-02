import type { CounterId, GuildCounters } from '#src/database/guild-data';
import { guildRef } from '#src/database/guild-data';
import { successEmbed } from '#src/utils/embed-utils';
import { capitalize } from '#src/utils/string-utils';
import type { IncrementableNumbers } from '#src/utils/types';
import type { Args, Command, PieceContext } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { Subcommand } from '@sapphire/plugin-subcommands';
import type { CacheType, ColorResolvable, Guild, Message } from 'discord.js';
import { EmbedBuilder } from 'discord.js';
import { getDoc, increment, setDoc } from 'firelord';

export abstract class CounterCommand<
    PreParseReturn extends Args = Args,
    O extends CounterCommand.Options = CounterCommand.Options,
> extends Subcommand<PreParseReturn, O> {
    protected constructor(context: PieceContext, options: O) {
        super(context, {
            ...options,
            subcommands: [
                { name: 'get', messageRun: 'get', default: true },
                { name: '=', messageRun: 'set' },
                ...(options.subcommands ?? []),
            ],
            runIn: 'GUILD_TEXT',
        });
    }

    protected formatValue(value: number): string {
        return value.toFixed(2);
    }

    protected async incrementValue(guild: Guild, offset = 1) {
        return setDoc(
            guildRef.doc(guild.id),
            {
                counters: {
                    [this.options.counterId]: increment(offset),
                } as IncrementableNumbers<GuildCounters>,
            },
            { merge: true },
        );
    }

    protected async setValue(guild: Guild, value: number) {
        return setDoc(
            guildRef.doc(guild.id),
            {
                counters: {
                    [this.options.counterId]: value,
                } as GuildCounters,
            },
            { merge: true },
        );
    }

    protected async getValue(guild: Guild): Promise<string | undefined> {
        return getDoc(guildRef.doc(guild.id))
            .then((doc) => doc.data()?.counters[this.options.counterId])
            .then((value) => (value ? this.formatValue(value) : undefined));
    }

    public async get(message: Message) {
        const { logger } = this.container;
        if (!message.guild) {
            logger.error('No guild');
            return;
        }

        await send(message, {
            embeds: [
                new EmbedBuilder()
                    .setColor(this.options.embedColor ?? '#2b2d31')
                    .setTitle(
                        this.options.embedTitle ??
                            `${capitalize(this.options.counterId)} counter`,
                    )
                    .setDescription(
                        `Amount: **${await this.getValue(message.guild)}**`,
                    ),
            ],
        });
    }

    public async set(message: Message, args: Args) {
        const { logger } = this.container;
        if (!message.guild) {
            logger.error('No guild');
            return;
        }

        const amount = await args.pick('number');

        await this.setValue(message.guild, amount);
        await send(message, {
            embeds: [successEmbed(`Counter updated, new amount: ${amount}`)],
        });
    }

    public async increment(message: Message, _args: Args) {
        const { logger } = this.container;
        if (!message.guild) {
            logger.error('No guild');
            return;
        }

        await this.incrementValue(message.guild, 1);
        await send(message, {
            embeds: [
                successEmbed(
                    `Counter updated, new amount: ${await this.getValue(
                        message.guild,
                    )}`,
                ),
            ],
        });
    }

    public async decrement(message: Message, _args: Args) {
        const { logger } = this.container;
        if (!message.guild) {
            logger.error('No guild');
            return;
        }

        await this.incrementValue(message.guild, -1);
        await send(message, {
            embeds: [
                successEmbed(
                    `Counter updated, new amount: ${await this.getValue(
                        message.guild,
                    )}`,
                ),
            ],
        });
    }
}

export interface CounterCommandOptions extends Subcommand.Options {
    counterId: CounterId;
    embedColor?: ColorResolvable;
    embedTitle?: string;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CounterCommand {
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
