import { style, keyframes } from '@vanilla-extract/css';
import { vars } from './vars.css';
import { sprinkles } from './sprinkles.css';

/* Layout helpers */

export const flexColumn = style({
  display: 'flex',
  flexDirection: 'column',
});

export const actions = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const textEclipse = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const scrollContainer = style({
  scrollbarColor: `${vars.colors.surfaceVariant} transparent`,
  scrollbarWidth: 'thin',
  overflow: 'auto',
  willChange: 'transform',
});

/* Interactable base */

export const interactable = style({
  position: 'relative',
  overflow: 'hidden',

  MozAppearance: 'none',
  WebkitAppearance: 'none',
  appearance: 'none',

  border: 'none',
  outline: 'none',
  textDecoration: 'none',
  cursor: 'pointer',

  display: 'flex',
  alignItems: 'center',
  zIndex: 0,

  '::after': {
    content: '',
    display: 'none',
    position: 'absolute',
    inset: 0,
    background: 'currentColor',
    zIndex: -1,
    pointerEvents: 'none',
  },

  '@media': {
    '(any-hover: hover)': {
      selectors: {
        '&:hover::after': {
          display: 'block',
          opacity: 0.08,
        },
        '&:disabled::after': {
          display: 'none',
        },
      },
    },
  },

  selectors: {
    '&:is(:focus-visible, :hover:focus-visible)': {
      outline: `2px solid ${vars.colors.onSurface}`,
      outlineOffset: '-2px',
    },
    '&:focus-visible::after': {
      display: 'block',
      opacity: 0.12,
    },
  },
});

/* Buttons */

export const baseButton = style([
  interactable,
  sprinkles({
    typography: 'labelLarge',
    justifyContent: 'center',
  }),
  style({
    gap: '8px',
    height: '40px',
    borderRadius: '20px',
  }),
]);

const disabledButton = style({
  cursor: 'auto',
  opacity: 0.24,
  background: vars.colors.onSurface,
  color: vars.colors.surface,
});

export const filledButton = style([
  baseButton,
  sprinkles({
    surface: 'primary',
    color: 'onPrimary',
  }),
  style({
    padding: '0 24px',
    selectors: {
      '&:disabled': disabledButton,
    },
  }),
]);

export const tonalButton = style([
  baseButton,
  sprinkles({
    surface: 'secondaryContainer',
    color: 'onSecondaryContainer',
  }),
  style({
    padding: '0 24px',
    selectors: {
      '&:disabled': disabledButton,
    },
  }),
]);

export const outlinedButton = style([
  baseButton,
  sprinkles({ color: 'primary' }),
  style({
    background: 'transparent',
    padding: '0 24px',
    border: `1px solid ${vars.colors.outline}`,
  }),
  style({
    selectors: {
      '&:disabled': {
        color: vars.colors.onSurface,
        opacity: 0.38,
        cursor: 'auto',
      },
    },
  }),
]);

export const flatButtonBase = style([
  baseButton,
  style({
    background: 'transparent',
    selectors: {
      '&:disabled': {
        color: vars.colors.onSurface,
        opacity: 0.38,
        cursor: 'auto',
      },
    },
  }),
]);

export const flatButton = style([
  flatButtonBase,
  sprinkles({ color: 'primary' }),
  style({
    padding: '0 12px',
  }),
]);

/* List items */

export const listItem = style([
  interactable,
  sprinkles({
    paddingLeft: '16px',
    paddingRight: '8px',
  }),
  style({
    width: '100%',
    height: '40px',
    alignItems: 'center',
    flexShrink: 0,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    contain: 'content',
    textAlign: 'initial',
  }),
]);

/* Text fields */

export const textFieldBase = style({
  MozAppearance: 'none',
  WebkitAppearance: 'none',
  appearance: 'none',

  padding: 0,
  border: 'none',
  width: '100%',
  height: '48px',
  outline: 'none !important',
  background: 'transparent',

  '::placeholder': {
    color: vars.colors.outline,
  },
});

export const textField = style([
  textFieldBase,
  sprinkles({
    typography: 'labelLarge',
    color: 'onSurface',
  }),
  style({
    padding: '0 16px',
    borderRadius: '8px',
    border: `2px solid ${vars.colors.outline}`,
    display: 'flex',
    alignItems: 'center',

    selectors: {
      '&:focus-within': {
        borderColor: vars.colors.primary,
      },
    },
  }),
]);

/* Animations */

export const fadeInAni = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

export const fadeOutAni = keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 },
});

/* Easing constants */

export const EASING_INCOMING_80_OUTGOING_40 = 'cubic-bezier(0.4, 0.0, 0.2, 1)';
export const EASING_INCOMING_80 = 'cubic-bezier(0, 0, 0.2, 1)';
export const EASING_OUTGOING_40 = 'cubic-bezier(0.4, 0, 1, 1)';

/* isolatedModules compatibility */
export {};
