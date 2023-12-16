/* eslint-disable */
import * as _m0 from 'protobufjs/minimal';

export const protobufPackage = '';

export enum Weekday {
    SUN = 0,
    MON = 1,
    TUE = 2,
    WED = 3,
    THU = 4,
    FRI = 5,
    SAT = 6,
    UNRECOGNIZED = -1,
}

export function weekdayFromJSON(object: any): Weekday {
    switch (object) {
        case 0:
        case 'SUN':
            return Weekday.SUN;
        case 1:
        case 'MON':
            return Weekday.MON;
        case 2:
        case 'TUE':
            return Weekday.TUE;
        case 3:
        case 'WED':
            return Weekday.WED;
        case 4:
        case 'THU':
            return Weekday.THU;
        case 5:
        case 'FRI':
            return Weekday.FRI;
        case 6:
        case 'SAT':
            return Weekday.SAT;
        case -1:
        case 'UNRECOGNIZED':
        default:
            return Weekday.UNRECOGNIZED;
    }
}

export function weekdayToJSON(object: Weekday): string {
    switch (object) {
        case Weekday.SUN:
            return 'SUN';
        case Weekday.MON:
            return 'MON';
        case Weekday.TUE:
            return 'TUE';
        case Weekday.WED:
            return 'WED';
        case Weekday.THU:
            return 'THU';
        case Weekday.FRI:
            return 'FRI';
        case Weekday.SAT:
            return 'SAT';
        case Weekday.UNRECOGNIZED:
        default:
            return 'UNRECOGNIZED';
    }
}

export interface Course {
    classes: Class[];
}

export interface Class {
    name: string;
    schedule: Period[];
}

export interface Period {
    name: string;
    day: Weekday;
    time: [number, number];
    room: string;
}

function createBaseCourse(): Course {
    return { classes: [] };
}

export const Course = {
    encode(message: Course, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
        for (const v of message.classes) {
            Class.encode(v!, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },

    decode(input: _m0.Reader | Uint8Array, length?: number): Course {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseCourse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }

                    message.classes.push(Class.decode(reader, reader.uint32()));
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },

    fromJSON(object: any): Course {
        return {
            classes: globalThis.Array.isArray(object?.classes) ? object.classes.map((e: any) => Class.fromJSON(e)) : [],
        };
    },

    toJSON(message: Course): unknown {
        const obj: any = {};
        if (message.classes?.length) {
            obj.classes = message.classes.map((e) => Class.toJSON(e));
        }
        return obj;
    },

    create<I extends Exact<DeepPartial<Course>, I>>(base?: I): Course {
        return Course.fromPartial(base ?? ({} as any));
    },
    fromPartial<I extends Exact<DeepPartial<Course>, I>>(object: I): Course {
        const message = createBaseCourse();
        message.classes = object.classes?.map((e) => Class.fromPartial(e)) || [];
        return message;
    },
};

function createBaseClass(): Class {
    return { name: '', schedule: [] };
}

export const Class = {
    encode(message: Class, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
        if (message.name !== '') {
            writer.uint32(10).string(message.name);
        }
        for (const v of message.schedule) {
            Period.encode(v!, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },

    decode(input: _m0.Reader | Uint8Array, length?: number): Class {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseClass();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }

                    message.name = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }

                    message.schedule.push(Period.decode(reader, reader.uint32()));
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },

    fromJSON(object: any): Class {
        return {
            name: isSet(object.name) ? globalThis.String(object.name) : '',
            schedule: globalThis.Array.isArray(object?.schedule) ? object.schedule.map((e: any) => Period.fromJSON(e)) : [],
        };
    },

    toJSON(message: Class): unknown {
        const obj: any = {};
        if (message.name !== '') {
            obj.name = message.name;
        }
        if (message.schedule?.length) {
            obj.schedule = message.schedule.map((e) => Period.toJSON(e));
        }
        return obj;
    },

    create<I extends Exact<DeepPartial<Class>, I>>(base?: I): Class {
        return Class.fromPartial(base ?? ({} as any));
    },
    fromPartial<I extends Exact<DeepPartial<Class>, I>>(object: I): Class {
        const message = createBaseClass();
        message.name = object.name ?? '';
        message.schedule = object.schedule?.map((e) => Period.fromPartial(e)) || [];
        return message;
    },
};

function createBasePeriod(): Period {
    return { name: '', day: 0, time: [0, 0], room: '' };
}

export const Period = {
    encode(message: Period, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
        if (message.name !== '') {
            writer.uint32(10).string(message.name);
        }
        if (message.day !== 0) {
            writer.uint32(16).int32(message.day);
        }
        writer.uint32(26).fork();
        for (const v of message.time) {
            writer.uint32(v);
        }
        writer.ldelim();
        if (message.room !== '') {
            writer.uint32(34).string(message.room);
        }
        return writer;
    },

    decode(input: _m0.Reader | Uint8Array, length?: number): Period {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePeriod();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }

                    message.name = reader.string();
                    continue;
                case 2:
                    if (tag !== 16) {
                        break;
                    }

                    message.day = reader.int32() as any;
                    continue;
                case 3:
                    if (tag === 24) {
                        message.time.push(reader.uint32());

                        continue;
                    }

                    if (tag === 26) {
                        const end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2) {
                            message.time.push(reader.uint32());
                        }

                        continue;
                    }

                    break;
                case 4:
                    if (tag !== 34) {
                        break;
                    }

                    message.room = reader.string();
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },

    fromJSON(object: any): Period {
        return {
            name: isSet(object.name) ? globalThis.String(object.name) : '',
            day: isSet(object.day) ? weekdayFromJSON(object.day) : 0,
            time: globalThis.Array.isArray(object?.time) ? object.time.map((e: any) => globalThis.Number(e)) : [],
            room: isSet(object.room) ? globalThis.String(object.room) : '',
        };
    },

    toJSON(message: Period): unknown {
        const obj: any = {};
        if (message.name !== '') {
            obj.name = message.name;
        }
        if (message.day !== 0) {
            obj.day = weekdayToJSON(message.day);
        }
        if (message.time?.length) {
            obj.time = message.time.map((e) => Math.round(e));
        }
        if (message.room !== '') {
            obj.room = message.room;
        }
        return obj;
    },

    create<I extends Exact<DeepPartial<Period>, I>>(base?: I): Period {
        return Period.fromPartial(base ?? ({} as any));
    },

    fromPartial<I extends Exact<DeepPartial<Period>, I>>(object: I): Period {
        const message = createBasePeriod();
        message.name = object.name ?? '';
        message.day = object.day ?? 0;
        message.time = (object.time?.map((e) => e) || [0, 0]) as [number, number];
        message.room = object.room ?? '';
        return message;
    },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
    : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
        : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
            : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
                : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
    : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
    return value !== null && value !== undefined;
}
