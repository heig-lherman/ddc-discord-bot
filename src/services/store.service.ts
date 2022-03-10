import rrhQuotes from '../../data/rrh.json';

const store = {
    inspiroBotQueues: new Map<string, boolean>(),
    rrhQuotes,
};

export default store;
