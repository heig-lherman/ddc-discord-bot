import {promisify} from 'node:util';
import {createClient, RedisClientType} from 'redis';

class Redis {
    public get: (key: string) => Promise<string | undefined>;
    public set: (key: string, value: string) => Promise<unknown>;
    public setEx: (
        key: string,
        seconds: number,
        value: string,
    ) => Promise<string>;

    public keys: (pattern: string) => Promise<string[]>;
    public scan: (
        cursor: string,
        options: string[],
    ) => Promise<Array<string | string[]>>;

    public del: (key: string) => Promise<number>;

    private readonly _client: RedisClientType;

    constructor() {
        this._client = createClient({
            url: process.env.REDIS_URL,
        });
        /* eslint-disable @typescript-eslint/no-unsafe-assignment */
        this.get = promisify(this._client.get).bind(this._client);
        this.set = promisify(this._client.set).bind(this._client);
        this.setEx = promisify(this._client.setEx).bind(this._client);
        this.keys = promisify(this._client.keys).bind(this._client);
        this.scan = promisify(this._client.scan).bind(this._client);
        this.del = promisify(this._client.del).bind(this._client);
        /* eslint-enable @typescript-eslint/no-unsafe-assignment */
    }

    /**
     * Returns the Redis Client instance.
     * The bot must be started first.
     */
    public get client(): RedisClientType {
        if (!this._client) {
            throw new Error('Redis was not started');
        }

        return this._client;
    }

    /**
     * Returns a promise that resolve in an array of keys matching a certain pattern.
     * @param cursor current position
     * @param pattern matching pattern
     */
    public async scanMatchingKeys(
        cursor: string,
        pattern: string,
    ): Promise<string[]> {
        const keys: string[] = [];
        do {
            // eslint-disable-next-line no-await-in-loop
            const scan = await this.scan(cursor, ['MATCH', pattern]);
            cursor = scan[0] as string;
            keys.push(...(scan[1] as string[]));
        } while (cursor !== '0');

        return keys;
    }
}

export default new Redis();
