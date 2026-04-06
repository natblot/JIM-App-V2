import { describe, expect, it } from 'vitest';
import { APP_NAME } from './index';

describe('constants', () => {
  it('APP_NAME doit être JIM', () => {
    expect(APP_NAME).toBe('JIM');
  });
});
