import '@sapphire/plugin-editable-commands/register';
import '@sapphire/plugin-hmr/register';
import '@sapphire/plugin-logger/register';
import '@sapphire/plugin-scheduled-tasks/register';
import '@sapphire/plugin-subcommands/register';

import dayjsParser from '../utils/dayjs-parser';
import {
    ApplicationCommandRegistries,
    container,
    RegisterBehavior,
} from '@sapphire/framework';
import dayjs from 'dayjs';

import 'dayjs/locale/fr-ch';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekday from 'dayjs/plugin/weekday';

import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

dayjs.extend(utc);
dayjs.extend(weekOfYear);
dayjs.extend(weekday);
dayjs.extend(localizedFormat);
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(timezone);
dayjs.extend(dayjsParser);
dayjs.locale('fr-ch');

initializeApp({
    credential: cert(process.env.FIREBASE_CREDENTIALS_PATH ?? ''),
});

container.database = getFirestore();
ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(
    RegisterBehavior.BulkOverwrite,
);
