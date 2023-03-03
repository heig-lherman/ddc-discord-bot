import { container } from '@sapphire/framework';
import type {
    CollectionReference,
    MetaType,
    Query,
    QueryDocumentSnapshot,
} from 'firelord';
import { documentId, getDocs, limit, query, where } from 'firelord';

const getQuery = <T extends MetaType>(
    collection: CollectionReference<T>,
    key: string,
    operator: '>=' | '<' = '>=',
): Query<T> => {
    return query(
        collection,
        where(documentId(), operator, key as never),
        limit(1),
    );
};

export const getRandomDocument = <T extends MetaType>(
    collection: CollectionReference<T>,
): Promise<QueryDocumentSnapshot<T> | undefined> => {
    const key: string = container.database.collection('tmp').doc().id;
    return getDocs(getQuery(collection, key))
        .then((snapshot) => {
            if (snapshot.empty) {
                return getDocs(getQuery(collection, key, '<'));
            }

            return snapshot;
        })
        .then((snapshot) => snapshot.docs[0]);
};
