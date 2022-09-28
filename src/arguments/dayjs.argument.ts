import { ApplyOptions } from '@sapphire/decorators';
import { Argument, Identifiers } from '@sapphire/framework';
import { Result } from '@sapphire/result';
import dayjs, { type Dayjs } from 'dayjs';

const MESSAGES: Record<string, (args: Argument.Context) => string> = {
    [Identifiers.ArgumentDateTooEarly]: ({ minimum }: Argument.Context) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        `The given date must be after ${new Date(minimum!).toISOString()}.`,
    [Identifiers.ArgumentDateTooFar]: ({ maximum }: Argument.Context) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        `The given date must be before ${new Date(maximum!).toISOString()}.`,
    [Identifiers.ArgumentDateError]: () =>
        'The argument did not resolve to a date.',
};

@ApplyOptions<Argument.Options>({
    name: 'dayjs',
    enabled: true,
})
export class DayjsArgument extends Argument<Dayjs> {
    public override run(
        parameter: string,
        context: Argument.Context<Dayjs>,
    ): Argument.Result<Dayjs> {
        const resolved = DayjsArgument.resolveDate(parameter, {
            minimum: context.minimum,
            maximum: context.maximum,
        });
        return resolved.mapErrInto((identifier) =>
            this.error({
                parameter,
                identifier,
                message: MESSAGES[identifier](context),
                context,
            }),
        );
    }

    private static resolveDate(
        parameter: string,
        options?: { minimum?: number; maximum?: number },
    ): Result<
        Dayjs,
        | Identifiers.ArgumentDateError
        | Identifiers.ArgumentDateTooEarly
        | Identifiers.ArgumentDateTooFar
    > {
        try {
            const parsed = dayjs(parameter, { locale: 'fr-ch' });

            if (!parsed.isValid()) {
                return Result.err(Identifiers.ArgumentDateError);
            }

            if (
                typeof options?.minimum === 'number' &&
                parsed.valueOf() < options.minimum
            ) {
                return Result.err(Identifiers.ArgumentDateTooEarly);
            }

            if (
                typeof options?.maximum === 'number' &&
                parsed.valueOf() > options.maximum
            ) {
                return Result.err(Identifiers.ArgumentDateTooFar);
            }

            return Result.ok(parsed);
        } catch (e: unknown) {
            return Result.err(Identifiers.ArgumentDateError);
        }
    }
}

declare module '@sapphire/framework' {
    interface ArgType {
        dayjs: Dayjs;
    }
}
