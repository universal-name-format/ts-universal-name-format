import add from '../';

describe('add 함수 테스트', () => {
  it('3 + 5 = 8', () => {
    const result = add(3, 5);
    expect(result).toBe(8);
  });

  it('-0 + -0 = -0', () => {
    const result = add(-0, -0);
    expect(result).toBe(-0);
  });

  it('Number.MAX_SAFE_INTEGER + NUMBER.MAX_SAFE_INTEGER = 18014398509481982', () => {
    const result = add(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
    expect(result).toBe(18014398509481982);
  });
});
