import { watchCloseResources } from "./watch-resources.mjs";

export function watchSocketClose(socket, timeout, onComplete) {
  let settled = false;
  let clearResources = () => {};
  const done = (error) => {
    if (settled) return;
    settled = true;
    clearResources();
    onComplete(error);
  };
  clearResources = watchCloseResources(socket, timeout, done);
  return done;
}
