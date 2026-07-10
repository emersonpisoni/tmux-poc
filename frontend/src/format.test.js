import { describe, it, expect } from 'vitest';
import { formatUptime } from './format.js';

describe('formatUptime', () => {
  it('shows seconds when under 1 minute', () => {
    expect(formatUptime(45)).toBe('45s');
  });

  it('shows minutes and seconds above 1 minute', () => {
    expect(formatUptime(90)).toBe('1m 30s');
  });

  it('handles zero', () => {
    expect(formatUptime(0)).toBe('0s');
  });
});
