export function cancelStreams(streams) {
  for (const stream of streams) void stream.return?.();
}
