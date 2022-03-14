import type { GuildDocument } from '#src/database/guild-document';
import { container } from '@sapphire/framework';
import { randomBytes } from 'crypto';
import type { Guild } from 'discord.js';
import type {
    DocumentData,
    DocumentReference,
    DocumentSnapshot,
    FirestoreDataConverter,
    QueryDocumentSnapshot,
} from 'firebase-admin/firestore';

export const converter = <T>(): FirestoreDataConverter<T> => ({
    fromFirestore(snapshot: QueryDocumentSnapshot): T {
        return snapshot.data() as T;
    },
    toFirestore(modelObject: T): DocumentData {
        return modelObject;
    },
});

export const getGuildCollection = async (
    guild: Guild,
): Promise<DocumentReference<GuildDocument>> => {
    return container.database
        .collection('guilds')
        .doc(guild.id)
        .withConverter(converter<GuildDocument>());
};

export const getGuildData = async (
    guild: Guild,
): Promise<DocumentSnapshot<GuildDocument>> => {
    return container.database
        .collection('guilds')
        .doc(guild.id)
        .withConverter(converter<GuildDocument>())
        .get();
};

export const autoId = (): string => {
    const chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let identifier = '';
    while (identifier.length < 20) {
        const bytes = randomBytes(40);
        for (const byte of bytes) {
            const maxValue = 62 * 4 - 1;
            if (identifier.length < 20 && byte <= maxValue) {
                identifier += chars.charAt(byte % 62);
            }
        }
    }
    return identifier;
};
