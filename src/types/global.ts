import type { HTMLAttributes } from 'solid-js';
import type { FocusTrap } from '@a11y/focus-trap';

/* -------------------------------------------------------------------------- */
/* Global browser typings                                                      */
/* -------------------------------------------------------------------------- */

declare global {
  interface Window {
    /**
     * Set during startup to disable the app on unsupported browsers.
     */
    isSupportedBrowser?: boolean;
  }

  interface Navigator {
    /**
     * Chromium User-Agent Client Hints API
     * Optional and not supported in all browsers.
     */
    userAgentData?: {
      mobile: boolean;
    };
  }

  interface IDBFactory {
    /**
     * Experimental IndexedDB API (supported in Chromium).
     */
    databases(): Promise<IDBDatabaseInfo[]>;
  }

  /**
   * PWA install prompt event
   */
  interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
      outcome: 'accepted' | 'dismissed';
      platform: string;
    }>;
    prompt(): Promise<void>;
  }
}

/* -------------------------------------------------------------------------- */
/* Solid JSX custom elements                                                   */
/* -------------------------------------------------------------------------- */

/* eslint-disable @typescript-eslint/no-namespace */
declare module 'solid-js' {
  namespace JSX {
    interface IntrinsicElements {
      /**
       * <focus-trap> web component
       */
      'focus-trap': HTMLAttributes<FocusTrap>;
    }
  }
}

/* isolatedModules safety */
export {};
