import '@sapphire/plugin-editable-commands/register';
import '@sapphire/plugin-hmr/register';
import '@sapphire/plugin-logger/register';
import '@sapphire/plugin-scheduled-tasks/register';

import dayjsParser from '../utils/dayjs-parser';
import { container } from '@sapphire/framework';

import dayjs from 'dayjs';
import 'dayjs/locale/fr-ch';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekday from 'dayjs/plugin/weekday';

import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

import IORedis from 'ioredis';

dayjs.extend(utc);
dayjs.extend(weekOfYear);
dayjs.extend(weekday);
dayjs.extend(localizedFormat);
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(dayjsParser);
dayjs.locale('fr-ch');

initializeApp({
    credential: cert(process.env.FIREBASE_CREDENTIALS_PATH ?? ''),
});

container.database = getFirestore();
container.redisClient = new IORedis(process.env.REDIS_URL ?? '');