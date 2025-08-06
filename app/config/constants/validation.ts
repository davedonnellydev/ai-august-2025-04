// Validation Rules
export const VALIDATION_RULES = {
  MIN_INPUT_LENGTH: 1,
  MAX_INPUT_LENGTH: 2000,
  ALLOWED_CHARACTERS: /^[\w\s.,!?-]*$/,
  RATE_LIMIT: {
    MAX_REQUESTS_PER_HOUR: 100,
    WINDOW_MS: 60 * 60 * 1000, // 1 hour
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded. Please try again later.',
  API_UNAVAILABLE: 'Translation service temporarily unavailable',
  INVALID_INPUT: 'Please enter a valid message',
  EMPTY_MESSAGE: 'Please enter a message',
  CONTENT_FLAGGED: 'Content flagged as inappropriate',
  NETWORK_ERROR: 'Network error. Please check your connection.',
} as const;
