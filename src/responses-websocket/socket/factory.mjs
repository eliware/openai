import { getDefaultSocketConstructor } from "./default.mjs";
import { createInjectedSocket } from "./injected.mjs";

export function createSocket(Impl, url, authHeaders) {
  return createInjectedSocket(Impl ?? getDefaultSocketConstructor(), url, authHeaders);
}
