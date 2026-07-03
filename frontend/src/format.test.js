import { describe, it, expect } from 'vitest';
import { formatUptime } from './format.js';

describe('formatUptime', () => {
  it('mostra segundos quando abaixo de 1 minuto', () => {
    expect(formatUptime(45)).toBe('45s');
  });

  it('mostra minutos e segundos acima de 1 minuto', () => {
    expect(formatUptime(90)).toBe('1m 30s');
  });

  it('lida com o zero', () => {
    expect(formatUptime(0)).toBe('0s');
  });
});
