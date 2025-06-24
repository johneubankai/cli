// Icon definitions for CLI output
export const icons = {
  success: '✓',
  error: '✗',
  warning: '⚠',
  info: 'ℹ',
  spinner: '◐',
  complete: '●',
  empty: '○',
  cancelled: '⊘',
  arrow: '→',
  check: '✔',
  cross: '✖',
  star: '★',
  heart: '♥',
  cloud: '☁',
  folder: '📁',
  file: '📄',
  lock: '🔒',
  unlock: '🔓',
  key: '🔑',
  globe: '🌍',
} as const;

export type IconType = keyof typeof icons;
