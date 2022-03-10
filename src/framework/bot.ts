import {once} from 'node:events';
import fs from 'node:fs';
import path from 'node:path';
import {Client} from 'discord.js';
import {GatewayIntentBits} from 'discord-api-types/v10';
import pino from 'pino';
import {Base, BaseConfig} from './base';

import {Command, PublicCommand} from './command';
import {Cron} from './cron';
import {FormatChecker} from './format-checker';

export interface BotOptions {
    /**
     * Discord token.
     * Defaults to `process.env.DISCORD_TOKEN`.
     */
    token?: string;
    /**
     * Directory that contains the `Cron` definitions.
     */
    commands?: string;
    /**
     * Directory that contains the `Cron` definitions.
     */
    crons?: string;
    /**
     * Directory that contains the `FormatChecker` definitions.
     */
    formatCheckers?: string;
}

type Constructor<T extends Base, U extends BaseConfig> = new (config: U) => T;

export class Bot {
    public readonly logger: pino.Logger;

    private readonly token?: string;
    private _client: Client | undefined;
    private readonly _commands: Command[] = [];
    private readonly _crons: Cron[] = [];
    private readonly _formatCheckers: FormatChecker[] = [];

    public constructor(options: BotOptions = {}) {
        this.token = options.token;
        this._client = undefined;
        this.logger = pino();

        if (options.commands) {
            this._commands = this.loadDirectory(
                options.commands,
                'commands',
                Command,
            );
        }

        if (options.crons) {
            this._crons = this.loadDirectory(options.crons, 'crons', Cron);
        }

        if (options.formatCheckers) {
            this._formatCheckers = this.loadDirectory(
                options.formatCheckers,
                'format-checkers',
                FormatChecker,
            );
        }
    }

    /**
     * Start the bot by connecting it to Discord.
     */
    public async start(): Promise<void> {
        if (this._client) {
            throw new Error('Bot can only be started once');
        }

        this._client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildEmojisAndStickers,
                GatewayIntentBits.GuildWebhooks,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildScheduledEvents,
            ],
        });
        try {
            await Promise.all([
                this.client.login(this.token),
                once(this.client, 'ready'),
            ]);
            // To remove 'MaxListenersExceededWarning' warning in console
            this._client.setMaxListeners(this._commands.length);
            this.verifyCommands();
            this.startCommands();
            this.startCrons();
            this.startFormatCheckers();
        } catch (error) {
            this._client = undefined;
            throw error;
        }
    }

    /**
     * Stop the bot.
     */
    public stop(): void {
        if (!this._client) {
            throw new Error('Bot was not started');
        }

        this.stopCommands();
        this.stopCrons();
        this.stopFormatCheckers();
        this._client.destroy();
        this._client = undefined;
    }

    /**
     * Returns the discord.js Client instance.
     * The bot must be started first.
     */
    public get client(): Client {
        if (!this._client) {
            throw new Error('Bot was not started');
        }

        return this._client;
    }

    public get commands(): PublicCommand[] {
        return this._commands.map((command) => ({
            name: command.name,
            alias: command.alias,
            description: command.description,
        }));
    }

    private loadDirectory<T extends Base, U extends BaseConfig>(
        directory: string,
        name: string,
        constructor: Constructor<T, U>,
    ): T[] {
        let list: string[];
        try {
            list = fs.readdirSync(directory);
        } catch (error: unknown) {
            if ((error as {code: string}).code === 'ENOENT') {
                throw new Error(
                    `Failed to load "${name}" in ${directory}. Directory could not be read`,
                );
            }

            throw error;
        }

        const allExports = list.map((file) => {
            const filePath = path.join(directory, file);
            // eslint-disable-next-line
            const value = require(filePath);
            if (
                !value ||
                !value.default ||
                !(value.default instanceof constructor)
            ) {
                throw new Error(
                    `${filePath} must export an instance of ${constructor.name}`,
                );
            }

            return value.default as T;
        });

        const enabledExports = allExports.filter((element) => element.enabled);

        if (enabledExports.length === allExports.length) {
            this.logger.info(
                `Loaded ${enabledExports.length} ${constructor.name}`,
            );
        } else {
            this.logger.info(
                `Loaded ${enabledExports.length} ${constructor.name} (${
                    allExports.length - enabledExports.length
                } disabled)`,
            );
        }

        return enabledExports;
    }

    private verifyCommands() {
        for (const [commandIndex, command] of this._commands.entries()) {
            for (const [
                otherCommandIndex,
                otherCommand,
            ] of this._commands.entries()) {
                if (
                    command.name === otherCommand.name &&
                    commandIndex !== otherCommandIndex
                ) {
                    throw new Error(
                        `Bot has duplicated commands! ${command.name} already exists.`,
                    );
                }

                command.alias?.forEach((alias) => {
                    otherCommand.alias?.forEach((otherAlias) => {
                        if (
                            alias === otherAlias &&
                            commandIndex !== otherCommandIndex
                        ) {
                            throw new Error(
                                `Bot has duplicated alias for command ${command.name}! alias ${alias} from ${otherCommand.name} already exists. `,
                            );
                        }
                    });
                });
            }
        }
    }

    private startCommands() {
        for (const command of this._commands) {
            command.start(this);
        }
    }

    private stopCommands() {
        for (const command of this._commands) {
            command.stop(this);
        }
    }

    private startCrons() {
        for (const cron of this._crons) {
            cron.start(this);
        }
    }

    private stopCrons() {
        for (const cron of this._crons) {
            cron.stop();
        }
    }

    private startFormatCheckers() {
        for (const formatChecker of this._formatCheckers) {
            formatChecker.start(this);
        }
    }

    private stopFormatCheckers() {
        for (const formatChecker of this._formatCheckers) {
            formatChecker.stop(this);
        }
    }
}
