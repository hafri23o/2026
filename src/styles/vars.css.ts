import {
  assignVars,
  createGlobalTheme,
  createThemeContract,
} from '@vanilla-extract/css';

import { getAppTheme, argbFromHex } from '../helpers/app-theme';

/* -------------------------------------------------------------------------- */
/* Root selector                                                              */
/* -------------------------------------------------------------------------- */

const ROOT_SELECTOR = ':root';

/* -------------------------------------------------------------------------- */
/* Color contract (static + type-safe)                                         */
/* -------------------------------------------------------------------------- */

export const colorsTheme = createThemeContract({
  primary: null,
  primaryRgb: null,
  onPrimary: null,
  primaryContainer: null,
  onPrimaryContainer: null,
  secondary: null,
  onSecondary: null,
  secondaryContainer: null,
  onSecondaryContainer: null,
  tertiary: null,
  onTertiary: null,
  tertiaryContainer: null,
  onTertiaryContainer: null,
  error: null,
  onError: null,
  errorContainer: null,
  onErrorContainer: null,
  outline: null,
  background: null,
  onBackground: null,
  surface: null,
  onSurface: null,
  surfaceVariant: null,
  onSurfaceVariant: null,
  inverseSurface: null,
  inverseOnSurface: null,
  inversePrimary: null,
});

/* -------------------------------------------------------------------------- */
/* Default themes                                                             */
/* -------------------------------------------------------------------------- */

const DEFAULT_THEME_SEED = argbFromHex('#ffdcc4');

export const defaultDarkTheme = assignVars(
  colorsTheme,
  getAppTheme(DEFAULT_THEME_SEED, true),
);

export const defaultLightTheme = assignVars(
  colorsTheme,
  getAppTheme(DEFAULT_THEME_SEED, false),
);

/* -------------------------------------------------------------------------- */
/* Global size tokens                                                         */
/* -------------------------------------------------------------------------- */

export const playerSizeVars = createGlobalTheme(ROOT_SELECTOR, {
  // padding-bottom 16 + controls-height 44 + gap 8 + timeline 24 + padding-top 8
  playerCardHeight: '100px',
});

export const layoutSizeVars = createGlobalTheme(ROOT_SELECTOR, {
  maxContentWidth: '2144px',
  headerHeight: '56px',
  playerCardOffset: `calc(${playerSizeVars.playerCardHeight} + 16px)`,
});

/* -------------------------------------------------------------------------- */
/* Public vars object                                                         */
/* -------------------------------------------------------------------------- */

export const vars = {
  colors: colorsTheme,
  sizes: {
    ...playerSizeVars,
    ...layoutSizeVars,
  },
};

/* isolatedModules safety */
export {};
