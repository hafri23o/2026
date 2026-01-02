import type { JSX } from 'solid-js';

declare module 'solid-js' {
  namespace JSX {
    interface IntrinsicElements {
      /**
       * Stripe Buy Button web component
       * https://stripe.com/docs/payments/checkout/buy-button
       */
      'stripe-buy-button': {
        buyButtonId: string;
        publishableKey: string;

        /** Optional attributes */
        customerEmail?: string;
        clientReferenceId?: string;
        successUrl?: string;
        cancelUrl?: string;

        /** Allow standard HTML attributes */
        [key: string]: any;
      };
    }
  }
}

/* isolatedModules safety */
export {};
