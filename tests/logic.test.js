import { evaluateGuess, validateGuess, generateSecret } from '../src/logic.js';

describe('evaluateGuess', () => {
  test('all exact matches', () => {
    expect(evaluateGuess('123456', '123456')).toEqual({ exact: 6, partial: 0 });
  });

  test('all partial matches', () => {
    expect(evaluateGuess('123456', '654321')).toEqual({ exact: 0, partial: 6 });
  });

  test('mixed matches', () => {
    expect(evaluateGuess('123456', '127834')).toEqual({ exact: 2, partial: 2 });
  });

  test('no matches', () => {
    expect(evaluateGuess('123456', '777777')).toEqual({ exact: 0, partial: 0 });
  });

  test('cases with repeated digits in secret', () => {
    expect(evaluateGuess('112233', '121212')).toEqual({ exact: 2, partial: 2 });
  });

  test('guess has more repeats than secret', () => {
    expect(evaluateGuess('123456', '111111')).toEqual({ exact: 1, partial: 0 });
  });
});

describe('validateGuess', () => {
  test('valid guess', () => {
    expect(validateGuess('123456', 6, false)).toEqual({ isValid: true });
  });

  test('invalid length', () => {
    expect(validateGuess('123', 6, false).isValid).toBe(false);
  });

  test('invalid characters', () => {
    expect(validateGuess('12a456', 6, false).isValid).toBe(false);
  });

  test('repeated digits when not allowed', () => {
    expect(validateGuess('112345', 6, false).isValid).toBe(false);
  });

  test('repeated digits when allowed', () => {
    expect(validateGuess('112345', 6, true).isValid).toBe(true);
  });
});

describe('generateSecret', () => {
  test('generates correct length', () => {
    const secret = generateSecret({ digits: 6, allowRepeats: false });
    expect(secret.length).toBe(6);
  });

  test('respects allowRepeats=false', () => {
    const secret = generateSecret({ digits: 6, allowRepeats: false });
    const seen = new Set(secret.split(''));
    expect(seen.size).toBe(6);
  });

  test('can generate 10 unique digits', () => {
    const secret = generateSecret({ digits: 10, allowRepeats: false });
    expect(new Set(secret.split('')).size).toBe(10);
  });
});
