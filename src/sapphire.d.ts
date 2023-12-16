import type { Firestore } from 'firebase-admin/lib/firestore';
import type { Redis } from 'ioredis';

declare module '@sapphire/pieces' {
    interface Container {
        redisClient: Redis;
        database: Firestore;
    }
}
