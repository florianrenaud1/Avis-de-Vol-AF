import { expect, test } from '@playwright/test';

// Extend the basic test with custom fixtures
export const baseTest = test.extend({
  // Add any custom fixtures here if needed
});

// Custom expect matchers
expect.extend({
  // Custom matcher for checking if element has Air France styling
  async toHaveAirFranceTheme(received: any) {
    const airFranceClasses = [
      'text-air-france-600',
      'bg-air-france-600',
      'border-air-france-600',
      'text-air-france-primary',
      'bg-air-france-primary'
    ];

    let hasAirFranceClass = false;
    
    for (const className of airFranceClasses) {
      const hasClass = await received.evaluate((el: Element, cls: string) => {
        return el.classList.contains(cls);
      }, className);
      
      if (hasClass) {
        hasAirFranceClass = true;
        break;
      }
    }

    return {
      message: () => hasAirFranceClass 
        ? 'Element has Air France theme classes'
        : 'Element does not have Air France theme classes',
      pass: hasAirFranceClass,
    };
  },
});

// Global setup for all tests
baseTest.beforeEach(async ({ page }) => {
  // Set default timeout for all operations
  page.setDefaultTimeout(30000);

  // Set up console logging for debugging
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.error(`Console Error: ${msg.text()}`);
    }
  });

  // Set up request/response logging for API calls
  page.on('response', (response) => {
    if (!response.ok() && response.status() !== 404) {
      console.warn(`HTTP ${response.status()}: ${response.url()}`);
    }
  });

  // Set default viewport
  await page.setViewportSize({ width: 1280, height: 720 });
});

export { expect } from '@playwright/test';
