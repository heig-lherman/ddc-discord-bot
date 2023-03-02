import type { Increment } from 'firelord/dist/types';

export type IncrementableNumbers<T extends Record<string, unknown>> = {
    [K in keyof T]: T[K] extends number ? number | Increment : T[K];
};
