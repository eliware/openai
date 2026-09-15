const MILLION = 1_000_000;

export function computeCosts(normalized, rates, longContext, multipliers) {
  const inputMultiplier = longContext ? multipliers.input : 1;
  const outputMultiplier = longContext ? multipliers.output : 1;
  const uncachedInput = Math.max(0, normalized.input - normalized.cachedInput - normalized.cacheWrite);
  const uncached = (uncachedInput * rates.input * inputMultiplier) / MILLION;
  const cached = (normalized.cachedInput * rates.cachedInput * inputMultiplier) / MILLION;
  const cacheWrite = (normalized.cacheWrite * rates.input * rates.cacheWriteMultiplier * inputMultiplier) / MILLION;
  const output = (normalized.output * rates.output * outputMultiplier) / MILLION;
  return { uncached, cached, cacheWrite, output, total: uncached + cached + cacheWrite + output };
}
