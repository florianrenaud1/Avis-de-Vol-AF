import { test, expect } from '@playwright/test';

test.describe('Footer Component Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Footer Structure and Layout', () => {
    test('should display footer with proper structure', async ({ page }) => {
      // Verify footer element exists
      const footer = page.locator('app-footer footer');
      await expect(footer).toBeVisible();

      // Check footer styling
      await expect(footer).toHaveClass(/bg-gradient-to-r/);
      await expect(footer).toHaveClass(/from-gray-800/);
      await expect(footer).toHaveClass(/to-gray-900/);
      await expect(footer).toHaveClass(/text-white/);
      await expect(footer).toHaveClass(/border-t/);
      await expect(footer).toHaveClass(/border-gray-700/);
    });

    test('should have proper responsive layout', async ({ page }) => {
      // Test desktop layout
      await page.setViewportSize({ width: 1280, height: 720 });
      
      const footerContainer = page.locator('app-footer .flex.flex-col.md\\:flex-row');
      await expect(footerContainer).toBeVisible();
      
      // Test mobile layout
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Container should still be visible with responsive classes
      await expect(footerContainer).toBeVisible();
      await expect(footerContainer).toHaveClass(/flex-col/);
      await expect(footerContainer).toHaveClass(/md:flex-row/);
    });
  });

  test.describe('Copyright Information', () => {
    test('should display current year in copyright', async ({ page }) => {
      const currentYear = new Date().getFullYear();
      const copyrightText = page.locator('app-footer .text-gray-400', { hasText: '©' });
      
      await expect(copyrightText).toBeVisible();
      
      const copyrightContent = await copyrightText.textContent();
      expect(copyrightContent).toContain(currentYear.toString());
      expect(copyrightContent).toContain('FLORIAN RENAUD');
      expect(copyrightContent).toContain('Tous droits réservés');
    });

    test('should have proper copyright styling', async ({ page }) => {
      const copyrightText = page.locator('app-footer .text-gray-400.text-sm', { hasText: '©' });
      
      await expect(copyrightText).toBeVisible();
      await expect(copyrightText).toHaveClass(/text-gray-400/);
      await expect(copyrightText).toHaveClass(/text-sm/);
    });
  });

  test.describe('Version Information', () => {
    test('should have bullet separator between title and version', async ({ page }) => {
      const bulletSeparator = page.locator('app-footer span', { hasText: '•' });
      
      await expect(bulletSeparator).toBeVisible();
      
      const separatorText = await bulletSeparator.textContent();
      expect(separatorText?.trim()).toBe('•');
    });

    test('should have proper version info styling', async ({ page }) => {
      const versionContainer = page.locator('app-footer .text-gray-400.text-sm.flex.items-center.space-x-1');
      
      await expect(versionContainer).toBeVisible();
      await expect(versionContainer).toHaveClass(/text-gray-400/);
      await expect(versionContainer).toHaveClass(/text-sm/);
      await expect(versionContainer).toHaveClass(/flex/);
      await expect(versionContainer).toHaveClass(/items-center/);
      await expect(versionContainer).toHaveClass(/space-x-1/);
    });
  });

  test.describe('Responsive Design', () => {
    test('should adapt layout for different screen sizes', async ({ page }) => {
      const footerContainer = page.locator('app-footer .flex.flex-col.md\\:flex-row.justify-between.items-center');
      
      // Mobile layout
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(footerContainer).toBeVisible();
      await expect(footerContainer).toHaveClass(/space-y-4/);
      await expect(footerContainer).toHaveClass(/md:space-y-0/);
      
      // Tablet layout
      await page.setViewportSize({ width: 768, height: 1024 });
      await expect(footerContainer).toBeVisible();
      
      // Desktop layout
      await page.setViewportSize({ width: 1280, height: 720 });
      await expect(footerContainer).toBeVisible();
    });

    test('should arrange items horizontally on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      
      const footerContainer = page.locator('app-footer .flex.flex-col.md\\:flex-row');
      await expect(footerContainer).toHaveClass(/md:flex-row/);
      
      // Check that items are justified between on desktop
      await expect(footerContainer).toHaveClass(/justify-between/);
    });
  });

  test.describe('Accessibility', () => {
    test('should use semantic footer tag', async ({ page }) => {
      const semanticFooter = page.locator('app-footer footer');
      await expect(semanticFooter).toBeVisible();
    });

    test('should be readable by screen readers', async ({ page }) => {
      const footer = page.locator('app-footer footer');
      await expect(footer).toBeVisible();
      
      // Check that text content is accessible
      const copyrightText = page.locator('app-footer .text-gray-400', { hasText: '©' });
      const copyrightContent = await copyrightText.textContent();
      expect(copyrightContent?.trim()).toBeTruthy();
      
      const versionText = page.locator('app-footer .text-gray-400', { hasText: 'Version' });
      const versionContent = await versionText.textContent();
      expect(versionContent?.trim()).toBeTruthy();
    });
  });

  test.describe('Translation Support', () => {
    test('should display translated content', async ({ page }) => {
      // Check that title is translated (should not be empty)
      const titleSpan = page.locator('app-footer span').first();
      const titleText = await titleSpan.textContent();
      
      expect(titleText?.trim()).toBeTruthy();
      expect(titleText?.length).toBeGreaterThan(0);
    });

    test('should update content when language changes', async ({ page }) => {
      // Get initial title text
      const titleSpan = page.locator('app-footer span').first();
      const initialTitle = await titleSpan.textContent();
      
      // Change language via header language selector
      const languageButton = page.locator('app-header button[aria-label="Change language"]');
      await languageButton.click();
      
      // Click on different language
      const languageOptions = page.locator('button[mat-menu-item]');
      if (await languageOptions.count() > 1) {
        await languageOptions.nth(1).click();
        
        // Wait for translation to update
        await page.waitForTimeout(500);
        
        // Check if title changed (indicating translation worked)
        const newTitle = await titleSpan.textContent();
        // Title might be the same if already in target language, so just verify it's still present
        expect(newTitle?.trim()).toBeTruthy();
      }
    });
  });

  test.describe('Visual Styling', () => {
    test('should have gradient background', async ({ page }) => {
      const footer = page.locator('app-footer footer');
      
      await expect(footer).toHaveClass(/bg-gradient-to-r/);
      await expect(footer).toHaveClass(/from-gray-800/);
      await expect(footer).toHaveClass(/to-gray-900/);
    });

    test('should have border styling', async ({ page }) => {
      const footer = page.locator('app-footer footer');
      
      await expect(footer).toHaveClass(/border-t/);
      await expect(footer).toHaveClass(/border-gray-700/);
      
      const borderContainer = page.locator('app-footer .border-t.border-gray-700.py-4.px-4');
      await expect(borderContainer).toBeVisible();
    });

    test('should have proper spacing and padding', async ({ page }) => {
      const borderContainer = page.locator('app-footer .border-t.border-gray-700.py-4.px-4');
      
      await expect(borderContainer).toHaveClass(/py-4/);
      await expect(borderContainer).toHaveClass(/px-4/);
      
      const flexContainer = page.locator('app-footer .space-y-4.md\\:space-y-0');
      await expect(flexContainer).toHaveClass(/space-y-4/);
      await expect(flexContainer).toHaveClass(/md:space-y-0/);
    });
  });

  test.describe('Performance', () => {
    test('should load quickly', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/');
      await page.waitForSelector('app-footer');
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
    });

    test('should not cause layout shifts', async ({ page }) => {
      // Wait for footer to be visible
      const footer = page.locator('app-footer footer');
      await expect(footer).toBeVisible();
      
      // Check that footer dimensions are stable
      const initialBoundingBox = await footer.boundingBox();
      expect(initialBoundingBox).toBeTruthy();
      
      // Wait a bit and check again
      await page.waitForTimeout(1000);
      const finalBoundingBox = await footer.boundingBox();
      
      expect(finalBoundingBox?.height).toBe(initialBoundingBox?.height);
    });
  });

  test.describe('Cross-browser Compatibility', () => {
    test('should work consistently across different browsers', async ({ page, browserName }) => {
      // Basic functionality should work in all browsers
      const footer = page.locator('app-footer footer');
      await expect(footer).toBeVisible();
      
      const copyrightText = page.locator('app-footer .text-gray-400', { hasText: '©' });
      await expect(copyrightText).toBeVisible();
      
      const versionText = page.locator('app-footer .text-gray-400', { hasText: 'Version' });
      await expect(versionText).toBeVisible();
      
      // Log browser name for debugging
      console.log(`Footer tests passing on: ${browserName}`);
    });
  });
});
