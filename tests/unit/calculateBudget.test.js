import { describe, it, expect } from 'vitest';
import { calculateBudget } from '../../src/utils/calculations.js';

describe('calculateBudget', () => {
  it.each([
    [{"targetG":0}, {"fixedCostTotal":0,"requiredMQ":0}],
    [{"targetG":100,"laborBudget":10,"manufacturingBudget":20,"depreciationBudget":5,"salesBudget":15,"adminBudget":8,"nonOperatingBudget":2,"rdBudget":6}, {"fixedCostTotal":66,"requiredMQ":166}],
    [{"targetG":"50","laborBudget":"10","rdBudget":"abc"}, {"fixedCostTotal":10,"requiredMQ":60}],
    [{}, {"fixedCostTotal":0,"requiredMQ":0}],
  ])('%j', (budget, expected) => {
    expect(calculateBudget(budget, {})).toEqual(expected);
  });

  it('必要MQ = 目標G + 固定費合計', () => {
    const r = calculateBudget({ targetG: 30, laborBudget: 5, adminBudget: 5 }, {});
    expect(r.requiredMQ).toBe(r.fixedCostTotal + 30);
  });

  it('carryoverを渡さなくても結果は変わらない', () => {
    expect(calculateBudget({ targetG: 10, laborBudget: 5 })).toEqual(calculateBudget({ targetG: 10, laborBudget: 5 }, {}));
  });
});
