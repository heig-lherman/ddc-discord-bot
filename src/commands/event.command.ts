import { Course, Period } from '../messaging/schedule';
import { int2mil, setDatetimeFromInt } from '../utils/date.utils';
import { errorEmbed, successEmbed } from '../utils/embed-utils';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry } from '@sapphire/framework';
import { Subcommand } from '@sapphire/plugin-subcommands';
import { oneLine, stripIndent } from 'common-tags';
import dayjs from 'dayjs';
import {
    ActionRowBuilder,
    ComponentType,
    GuildScheduledEventEntityType,
    GuildScheduledEventPrivacyLevel,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    TextChannel,
    TextInputBuilder,
    TextInputStyle,
} from 'discord.js';

const ids = {
    classInput: 'class-select',
    periodInput: 'period-select',
    dateInput: 'date-select',
    modal: {
        id: 'create-event',
        title: 'event-title',
        description: 'event-description',
    },
};

const stages = [
    { question: 'Select a class' },
    { question: 'Select the period of the week' },
    { question: 'Select the date of the event' },
];

@ApplyOptions<Subcommand.Options>({
    name: 'event',
    enabled: true,
    runIn: 'GUILD_TEXT',
    description: 'Edit events for a specific class',
    subcommands: [
        {
            name: 'create',
            default: true,
            chatInputRun: 'createEvent',
        },
        {
            name: 'delete',
            chatInputRun: 'deleteEvent',
        },
    ],
})
export default class EventCommand extends Subcommand {
    override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand(
            (builder) =>
                builder
                    .setName(this.name)
                    .setDescription(this.description)
                    .addSubcommand((command) =>
                        command
                            .setName('create')
                            .setDescription('Create a new event'),
                    )
                    .addSubcommand((command) =>
                        command
                            .setName('delete')
                            .setDescription('Delete an event')
                            .addStringOption((option) =>
                                option
                                    .setName('id')
                                    .setDescription('The event ID')
                                    .setRequired(true),
                            ),
                    ),
            { idHints: ['1185637298335920233'] },
        );
    }

    async createEvent(interaction: Subcommand.ChatInputCommandInteraction) {
        const reply = await interaction.deferReply({ ephemeral: true });
        try {
            const channel = (await interaction.channel?.fetch()) as TextChannel;
            const course = parseCourse(channel.topic);
            if (!course) {
                return reply.edit({
                    embeds: [
                        errorEmbed('This channel is not linked to a course'),
                    ],
                });
            }

            const classMap = course.classes.reduce<Record<string, Period[]>>(
                (acc, c) => ({
                    ...acc,
                    [c.name]: c.schedule,
                }),
                {},
            );

            const classSelect = new StringSelectMenuBuilder()
                .setCustomId(ids.classInput)
                .setOptions(
                    Object.keys(classMap).map((c) =>
                        new StringSelectMenuOptionBuilder()
                            .setLabel(c)
                            .setValue(c),
                    ),
                );

            await reply.edit({
                content: buildMessageContent(0),
                components: [
                    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                        classSelect,
                    ),
                ],
            });

            const classSelectInteraction = await reply.awaitMessageComponent({
                componentType: ComponentType.StringSelect,
                time: 1000 * 60 * 3,
            });

            const selectedClassName = classSelectInteraction.values[0];
            if (!selectedClassName) {
                return reply.edit({
                    embeds: [errorEmbed('No class selected')],
                });
            }

            const periods = classMap[selectedClassName]!;
            const periodSelect = new StringSelectMenuBuilder()
                .setCustomId(ids.classInput)
                .setOptions(
                    periods.map((p) =>
                        new StringSelectMenuOptionBuilder()
                            .setLabel(buildPeriodName(p))
                            .setValue(p.name),
                    ),
                );

            await classSelectInteraction.update({
                content: buildMessageContent(1, selectedClassName),
                components: [
                    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                        periodSelect,
                    ),
                ],
            });

            const periodSelectInteraction = await reply.awaitMessageComponent({
                componentType: ComponentType.StringSelect,
                time: 1000 * 60 * 3,
            });

            const selectedPeriod = periods.find(
                (p) => p.name === periodSelectInteraction.values[0],
            );
            if (!selectedPeriod) {
                return reply.edit({
                    embeds: [errorEmbed('No period selected')],
                });
            }

            const dateSelect = new StringSelectMenuBuilder()
                .setCustomId(ids.dateInput)
                .setOptions(getNextDates(selectedPeriod));

            await periodSelectInteraction.update({
                content: buildMessageContent(
                    2,
                    selectedClassName,
                    buildPeriodName(selectedPeriod),
                ),
                components: [
                    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                        dateSelect,
                    ),
                ],
            });

            const dateSelectInteraction = await reply.awaitMessageComponent({
                componentType: ComponentType.StringSelect,
                time: 1000 * 60 * 3,
            });

            const contentModal = new ModalBuilder()
                .setCustomId(ids.modal.id)
                .setTitle('Event details')
                .addComponents(
                    new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
                        new TextInputBuilder()
                            .setCustomId(ids.modal.title)
                            .setLabel('Event title')
                            .setStyle(TextInputStyle.Short)
                            .setPlaceholder('TE1')
                            .setRequired(true),
                    ),
                    new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
                        new TextInputBuilder()
                            .setCustomId(ids.modal.description)
                            .setLabel('Event description')
                            .setStyle(TextInputStyle.Paragraph)
                            .setRequired(false),
                    ),
                );

            await dateSelectInteraction.showModal(contentModal);
            const modalInteraction =
                await dateSelectInteraction.awaitModalSubmit({
                    time: 1000 * 60 * 5,
                });

            if (!modalInteraction.isFromMessage()) {
                // illegal state
                return undefined;
            }

            const day = dayjs(dateSelectInteraction.values[0]);
            const startDate = setDatetimeFromInt(day, selectedPeriod.time[0]);
            const endDate = setDatetimeFromInt(day, selectedPeriod.time[1]);

            await modalInteraction.update({
                content: `${buildMessageContent(
                    3,
                    selectedClassName,
                    buildPeriodName(selectedPeriod),
                    day.format('DD/MM/YYYY'),
                )}\n\n:ballot_box_with_check: Creating event...`,
                components: [],
            });

            const scheduledEvent =
                await interaction.guild!.scheduledEvents.create({
                    entityType: GuildScheduledEventEntityType.External,
                    entityMetadata: {
                        location: `HEIG-VD - ${selectedPeriod.room}`,
                    },
                    name: `${selectedClassName} - ${
                        modalInteraction.fields.getField(ids.modal.title).value
                    }`,
                    description: modalInteraction.fields.getField(
                        ids.modal.description,
                    ).value,
                    scheduledStartTime: startDate.toISOString(),
                    scheduledEndTime: endDate.toISOString(),
                    privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
                });

            return await modalInteraction.followUp({
                content: stripIndent`
                    :white_check_mark: **Success**: New event created for this class

                    Course: ${selectedClassName}-${selectedPeriod.name}
                    Date: ${startDate.format('DD/MM/YYYY HH:mm')}

                    :link: [View event](${scheduledEvent.url})
                    ID: \`${scheduledEvent.id}\`
                `,
            });
        } catch (e) {
            this.container.logger.error(e);
            return reply.edit({
                embeds: [
                    errorEmbed(
                        'Builder canceled, no interaction within timeout',
                    ),
                ],
                content: null,
                components: [],
            });
        }
    }

    async deleteEvent(interaction: Subcommand.ChatInputCommandInteraction) {
        try {
            await interaction.guild?.scheduledEvents.delete(
                interaction.options.getString('id', true),
            );

            return interaction.reply({
                embeds: [successEmbed('Event successfully deleted')],
            });
        } catch (e) {
            this.container.logger.error(e);
            return interaction.reply({
                embeds: [
                    errorEmbed('An issue occured while deleting the event'),
                ],
            });
        }
    }
}

const parseCourse = (topic: string | null): Course | undefined => {
    const encoded = topic
        ?.split('\n')
        ?.find((m) => m.startsWith('sch:'))
        ?.substring(4);

    if (!encoded) {
        return undefined;
    }

    return Course.decode(Buffer.from(encoded, 'base64'));
};

const buildMessageContent = (stage: number, ...previousValues: string[]) => {
    const question = stages[stage]?.question;
    const previous = previousValues
        .map((v, i) => `:white_check_mark: ${stages[i]?.question}: **${v}**`)
        .join('\n');

    if (!question) {
        return `**Class Event Builder**\n${previous ? `\n${previous}` : ''}`;
    }

    return `**Class Event Builder**\n${
        previous ? `\n${previous}` : ''
    }\n:question: ${question}`;
};

const buildPeriodName = (period: Period): string => {
    const weekday = dayjs()
        .weekday(period.day - 1)
        .format('dddd');

    return oneLine`
        ${period.name}:
        ${weekday} ${int2mil(period.time[0])} - ${int2mil(period.time[1])}
        en ${period.room}
    `;
};

const getNextDates = (period: Period): StringSelectMenuOptionBuilder[] => {
    const today = dayjs().utc().startOf('day');
    const nextDates = [];

    for (let i = 0; i < 16; i++) {
        const date = today.add(i, 'week').weekday(period.day - 1);
        nextDates.push(
            new StringSelectMenuOptionBuilder()
                .setLabel(date.format('DD/MM/YYYY'))
                .setValue(date.toISOString()),
        );
    }

    return nextDates;
};
