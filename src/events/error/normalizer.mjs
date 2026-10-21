export function normalizeEventError(event) {
  const error = event.error;
  const nestedError = error !== null && typeof error === "object" ? error : undefined;
  return {
    ...(error === undefined ? {} : { error }),
    requestId: nestedError?.request_id ?? nestedError?.requestId,
  };
}
