import brokers from '../../../data/brokers.json'
import etfs from '../../../data/etfs.json'
import sources from '../../../data/sources.json'

// The data files as imported modules, so a page can use them at build time
// without reading the file system (which Cache Components treats as uncached
// data). Changing the data means rebuilding, which is how it ships anyway.
export const bundledData = { etfs, brokers, sources }
