import { ApplyOptions } from '@sapphire/decorators';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import type { Snowflake } from 'discord-api-types/globals';

const GUILDS: Snowflake[] = ['449970210053554206', '887670429760749569'];

@ApplyOptions<ScheduledTask.Options>({
    cron: '0 4 * * 6',
})
export default class InspirobotRemovalTask extends ScheduledTask {
    public override async run() {
        const { client } = this.container;

        const guilds = await Promise.all(GUILDS.map(client.guilds.cache.get));
        guilds.forEach((guild) =>
            guild
                ?.fetchWebhooks()
                .then((whs) =>
                    whs
                        .filter((wh) => wh.name === 'Inspirobot')
                        .forEach((wh) => wh.delete('Webhook cleanup.')),
                ),
        );
    }
}
