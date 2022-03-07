import rrhQuotes from '../../data/rrh.json';

const Store = {
  inspiroBotQueues: new Map<string, boolean>(),
  rrhQuotes,
};

export default Store;
