// UI Configuration
export const UI_CONFIG = {
  MAX_INPUT_LENGTH: 2000,
  MAX_TEXTAREA_ROWS: 4,
  AUTO_SCROLL_BEHAVIOR: 'smooth' as const,
  CHAT_WINDOW: {
    DEFAULT_WIDTH: 400,
    DEFAULT_HEIGHT: 500,
    MINIMIZED_SIZE: 60,
  },
} as const;

// Animation Configuration
export const ANIMATION_CONFIG = {
  TRANSITION_DURATION: 200,
  PULSE_DURATION: 2000,
  HOVER_SCALE: 1.1,
} as const;
