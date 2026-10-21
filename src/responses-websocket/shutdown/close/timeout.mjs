import { createCloseTimeoutError } from "../timeout-error.mjs";

export function startCloseTimeout(socket, timeout, onTimeout) {
  const timer = setTimeout(
    () => {
      try {
        socket.terminate?.();
      } catch {}
      onTimeout(createCloseTimeoutError());
    },
    Math.max(0, timeout),
  );
  return () => clearTimeout(timer);
}
