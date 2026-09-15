const pendingURLs = new WeakMap();
const pendingImplementations = new WeakMap();

export function prepareClient(client, url, implementation) { if (url) pendingURLs.set(client, url); if (implementation) pendingImplementations.set(client, implementation); return client; }
export function consumeClientConfiguration(client) { const configuration = { url: pendingURLs.get(client), implementation: pendingImplementations.get(client) }; pendingURLs.delete(client); pendingImplementations.delete(client); return configuration; }
