export function writeLog(logger, level, message, context) {
  if (!logger) return;
  try {
    logger.log(level, message, { component: "@eliware/openai", ...context });
  } catch {}
}
