// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import 'any-date-parser';
import type { PluginFunc } from 'dayjs';
import dayjs from 'dayjs';

const plugin: PluginFunc<unknown> = (_option: unknown, dayjsClass) => {
    const defParse = dayjsClass.prototype.parse;
    dayjs.prototype.parse = function parse(config: { date: unknown }) {
        if (typeof config.date === 'string') {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const parsed = Date.fromString(config.date, this.$locale().name);
            if (parsed instanceof Date) {
                // eslint-disable-next-line no-param-reassign
                config.date = parsed;
            }
        }

        return defParse.call(this, config);
    };
};

export default plugin;
declare module 'dayjs' {
    interface Dayjs {
        parse(config?: { date: unknown }): void;
    }
}
