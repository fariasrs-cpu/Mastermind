/**
 * Generates a secret code.
 * @param {Object} options - Configuration options.
 * @param {number} options.digits - Number of digits in the secret.
 * @param {boolean} options.allowRepeats - Whether digits can repeat.
 * @returns {string} The generated secret code.
 */
export function generateSecret({ digits = 6, allowRepeats = false } = {}) {
  const availableDigits = '0123456789'.split('');
  let secret = '';

  if (!allowRepeats && digits > 10) {
    throw new Error('Cannot generate secret with more than 10 unique digits.');
  }

  for (let i = 0; i < digits; i++) {
    if (allowRepeats) {
      const randomIndex = Math.floor(Math.random() * availableDigits.length);
      secret += availableDigits[randomIndex];
    } else {
      const randomIndex = Math.floor(Math.random() * availableDigits.length);
      secret += availableDigits.splice(randomIndex, 1)[0];
    }
  }

  return secret;
}

/**
 * Evaluates a guess against a secret code.
 * @param {string} secret - The secret code.
 * @param {string} guess - The user's guess.
 * @returns {Object} The evaluation result: { exact, partial }.
 */
export function evaluateGuess(secret, guess) {
  let exact = 0;
  let partial = 0;

  const secretArr = secret.split('');
  const guessArr = guess.split('');

  const secretMatched = new Array(secretArr.length).fill(false);
  const guessMatched = new Array(guessArr.length).fill(false);

  // Check for exact matches
  for (let i = 0; i < guessArr.length; i++) {
    if (guessArr[i] === secretArr[i]) {
      exact++;
      secretMatched[i] = true;
      guessMatched[i] = true;
    }
  }

  // Check for partial matches
  for (let i = 0; i < guessArr.length; i++) {
    if (guessMatched[i]) continue;

    for (let j = 0; j < secretArr.length; j++) {
      if (!secretMatched[j] && guessArr[i] === secretArr[j]) {
        partial++;
        secretMatched[j] = true;
        break;
      }
    }
  }

  return { exact, partial };
}

/**
 * Validates a guess.
 * @param {string} guess - The user's guess.
 * @param {number} length - The expected length.
 * @param {boolean} allowRepeats - Whether digits can repeat.
 * @returns {Object} { isValid, message }.
 */
export function validateGuess(guess, length, allowRepeats) {
  if (guess.length !== length) {
    return { isValid: false, message: `Guess must be ${length} digits long.` };
  }

  if (!/^\d+$/.test(guess)) {
    return { isValid: false, message: 'Guess must contain only digits.' };
  }

  if (!allowRepeats) {
    const seen = new Set();
    for (const char of guess) {
      if (seen.has(char)) {
        return { isValid: false, message: 'Digits cannot be repeated in this mode.' };
      }
      seen.add(char);
    }
  }

  return { isValid: true };
}
