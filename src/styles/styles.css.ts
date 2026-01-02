// Central style exports for the app.
// This file is intentionally side-effect free and safe for isolatedModules.

import { vars } from './vars.css';
import { sprinkles } from './sprinkles.css';
import * as sharedStyles from './shared.css.ts';

export { vars, sprinkles, sharedStyles };

// Optional: re-export sprinkles type for consumers
export type { Sprinkles } from './sprinkles.css';

// Ensure this file is treated as a module under isolatedModules
export {};
