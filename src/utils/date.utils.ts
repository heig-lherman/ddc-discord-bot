import { Dayjs } from 'dayjs';

export const int2mil = (int: number): string => {
    const str = String(int).padStart(4, '0');
    return `${str.slice(0, 2)}:${str.slice(2)}`;
};

export const setDatetimeFromInt = (day: Dayjs, int: number): Dayjs => {
    const str = String(int).padStart(4, '0');
    return day
        .set('hour', Number(str.slice(0, 2)))
        .set('minute', Number(str.slice(2)));
};
