// API Configuration
export const API_ENDPOINTS = {
  OPENAI_RESPONSES: '/api/openai/responses',
  OPENAI_RESPONSES_BY_ID: (id: string) => `/api/openai/responses/${id}`,
  OPENAI_INPUT_ITEMS: (id: string) => `/api/openai/responses/${id}/input_items`,
} as const;

export const API_CONFIG = {
  TIMEOUT: 5000,
  RETRY_ATTEMPTS: 3,
  HEADERS: {
    'Content-Type': 'application/json',
  },
} as const;
