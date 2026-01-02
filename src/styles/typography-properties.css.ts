/* Typography scale tokens
 * Static + Vanilla Extract safe
 */

export const fontSizes = {
  headlineMedium: '28px',
  headlineSmall: '24px',
  titleLarge: '22px',
  titleMedium: '16px',
  titleSmall: '14px',
  labelLarge: '14px',
  labelMedium: '12px',
  labelSmall: '11px',
  bodyLarge: '16px',
  bodyMedium: '14px',
  bodySmall: '12px',
} as const;

export const lineHeight = {
  headlineMedium: '36px',
  headlineSmall: '32px',
  titleLarge: '28px',
  titleMedium: '24px',
  titleSmall: '20px',
  labelLarge: '20px',
  labelMedium: '16px',
  labelSmall: '16px',
  bodyLarge: '24px',
  bodyMedium: '20px',
  bodySmall: '16px',
} as const;

export const letterSpacing = {
  headlineMedium: '0',
  headlineSmall: '0',
  titleLarge: '0',
  titleMedium: '0.15px',
  titleSmall: '0.1px',
  labelLarge: '0.1px',
  labelMedium: '0.5px',
  labelSmall: '0.5px',
  bodyLarge: '0.15px',
  bodyMedium: '0.25px',
  bodySmall: '0.4px',
} as const;

export const fontWeight = {
  headlineMedium: 400,
  headlineSmall: 400,
  titleLarge: 500,
  titleMedium: 500,
  titleSmall: 500,
  labelLarge: 500,
  labelMedium: 500,
  labelSmall: 500,
  bodyLarge: 400,
  bodyMedium: 400,
  bodySmall: 400,
} as const;

/* Shared token type (optional but useful) */
export type TypographyToken = keyof typeof fontSizes;

/* isolatedModules safety */
export {};
