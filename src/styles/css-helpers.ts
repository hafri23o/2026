// Import necessary utilities from @vanilla-extract/css
import { CSSProperties, keyframes } from '@vanilla-extract/css';

/**
 * Creates 'from' and 'to' keyframes with the given frame properties.
 * @param frames The CSS properties to apply at both the 'from' and 'to' keyframes.
 * @returns A tuple of 'from' and 'to' keyframes.
 */
export const createFromToKeyframes = (frames: CSSProperties) => {
  // Helper function to create keyframes for a given time label ('from' or 'to')
  const cKeyframes = (time: string) =>
    keyframes({
      [time]: frames,
    });

  // Return a tuple with 'from' and 'to' keyframes
  return [cKeyframes('from'), cKeyframes('to')] as const;
};

/**
 * Extracts the variable name from a CSS variable declaration.
 * @param variable A CSS variable, e.g., 'var(--my-variable)'.
 * @returns The name of the variable, or the input string if it's not a valid CSS variable.
 */
export function getVarName(variable: string): string {
  // Match 'var(--my-variable)' and extract the variable name inside the parentheses
  const matches = /^var\((.*)\)$/.exec(variable);

  // Return the extracted variable name, or the original variable string if it doesn't match the pattern
  if (matches) {
    return matches[1];
  }

  return variable;
}
