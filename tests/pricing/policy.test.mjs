import { LONG_CONTEXT_INPUT_MULTIPLIERS, LONG_CONTEXT_INPUT_THRESHOLD } from '../../src/pricing/policy.mjs';
test('defines the codescope pricing policy', () => { expect(LONG_CONTEXT_INPUT_THRESHOLD).toBe(272000); expect(LONG_CONTEXT_INPUT_MULTIPLIERS).toEqual({ input: 2, output: 1.5 }); });
