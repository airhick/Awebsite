// TypeScript declarations for external APIs

declare global {
  interface Window {
    google: any;
    Vapi: any;
    Calendly?: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
      }) => void;
    };
    initGoogleMaps: () => void;
    googleMapsLoaded?: boolean;
    googleMapsInitialized?: boolean;
    googleMapsRetryCount?: number;
    [key: string]: any; // Allow any dynamic property
  }
}

export {};
