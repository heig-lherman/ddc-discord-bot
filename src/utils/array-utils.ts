export function shuffleArray(array: unknown[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // eslint-disable-next-line no-param-reassign
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export function groupBy<T, K extends string>(arr: T[], key: (item: T) => K) {
    return arr.reduce(
        (acc, curr) => {
            const group = key(curr);
            if (!acc[group]) {
                acc[group] = [];
            }
            acc[group].push(curr);
            return acc;
        },
        {} as Record<K, T[]>,
    );
}
