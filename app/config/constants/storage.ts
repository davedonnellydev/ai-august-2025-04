// Local Storage Keys
export const STORAGE_KEYS = {
  PREVIOUS_RESPONSE_ID: 'previous_response_id',
  RATE_LIMIT_DATA: 'rate_limit_data',
  USER_PREFERENCES: 'user_preferences',
} as const;

// Storage Configuration
export const STORAGE_CONFIG = {
  PREFIX: 'chat_app_',
  EXPIRY_CHECK_INTERVAL: 5 * 60 * 1000, // 5 minutes
} as const;
