import { expect, test } from '@jest/globals';
import { computeCosts } from '../../src/pricing/compute-costs.mjs';
test('computes pricing components', () => { const c = computeCosts({ input: 2_000_000, cachedInput: 0, cacheWrite: 0, output: 1_000_000 }, { input: 1, cachedInput: 0, cacheWriteMultiplier: 1, output: 2 }, true, { input: 2, output: 3 }); expect(c.total).toBe(10); });
