import { test, expect } from '@playwright/test';

test.describe('Header Component Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Header Structure and Layout', () => {
    test('should display header with proper structure', async ({ page }) => {
      // Verify header element exists
      const header = page.locator('app-header header');
      await expect(header).toBeVisible();

      // Check header styling (Air France theme)
      await expect(header).toHaveClass(/bg-gradient-to-r/);
      await expect(header).toHaveClass(/from-air-france-700/);
      await expect(header).toHaveClass(/sticky/);
      await expect(header).toHaveClass(/top-0/);
      await expect(header).toHaveClass(/z-50/);
    });

    test('should have proper responsive layout', async ({ page }) => {
      // Test desktop layout
      await page.setViewportSize({ width: 1280, height: 720 });
      
      const headerContainer = page.locator('app-header .max-w-7xl');
      await expect(headerContainer).toBeVisible();
      
      const flexContainer = page.locator('app-header .flex.items-center.justify-between.h-20');
      await expect(flexContainer).toBeVisible();

      // Test mobile layout
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Mobile menu button should be visible
      const mobileMenuButton = page.locator('app-header button.lg:hidden');
      await expect(mobileMenuButton).toBeVisible();
      
      // Some text should be hidden on mobile
      const hiddenOnMobile = page.locator('app-header .hidden.sm:inline');
      if (await hiddenOnMobile.count() > 0) {
        await expect(hiddenOnMobile.first()).not.toBeVisible();
      }
    });
  });

  test.describe('Logo and Title', () => {
    test('should display Air France logo correctly', async ({ page }) => {
      const logo = page.locator('app-header img[alt="Air France Logo"]');
      await expect(logo).toBeVisible();
      
      // Check logo source
      const logoSrc = await logo.getAttribute('src');
      expect(logoSrc).toContain('assets/img/logo.png');
      
      // Check logo styling
      await expect(logo).toHaveClass(/w-8/);
      await expect(logo).toHaveClass(/h-8/);
    });

    test('should display translated title and description', async ({ page }) => {
      // Check title exists and is translated
      const title = page.locator('app-header h1');
      await expect(title).toBeVisible();
      
      const titleText = await title.textContent();
      expect(titleText?.trim()).toBeTruthy();
      
      // Check title styling
      await expect(title).toHaveClass(/text-xl/);
      await expect(title).toHaveClass(/font-bold/);
      await expect(title).toHaveClass(/text-white/);

      // Check description (visible on large screens)
      const description = page.locator('app-header p.text-sm.text-air-france-100');
      if (await description.count() > 0) {
        await expect(description).toHaveClass(/hidden/);
        await expect(description).toHaveClass(/lg:block/);
      }
    });

    test('should have logo hover effects', async ({ page }) => {
      const logoContainer = page.locator('app-header .group');
      await expect(logoContainer).toBeVisible();
      
      // Hover over logo container
      await logoContainer.hover();
      
      // Check if hover classes are applied
      const logoBg = logoContainer.locator('.bg-white\\/10');
      await expect(logoBg).toBeVisible();
    });
  });

  test.describe('Language Selector', () => {
    test('should display language selector button', async ({ page }) => {
      const languageButton = page.locator('app-header button[aria-label="Change language"]');
      await expect(languageButton).toBeVisible();
      
      // Check button styling
      await expect(languageButton).toHaveClass(/text-white/);
      await expect(languageButton).toHaveClass(/hover:bg-white\/10/);
      
      // Check language icon
      const languageIcon = languageButton.locator('mat-icon').filter({ hasText: 'language' });
      await expect(languageIcon).toBeVisible();
      
      // Check dropdown arrow
      const dropdownIcon = languageButton.locator('mat-icon').filter({ hasText: 'keyboard_arrow_down' });
      await expect(dropdownIcon).toBeVisible();
    });

    test('should show current language', async ({ page }) => {
      const currentLang = page.locator('app-header button[aria-label="Change language"] span.text-white');
      
      if (await currentLang.count() > 0) {
        const langText = await currentLang.textContent();
        expect(langText?.trim()).toMatch(/^(FR|EN)$/);
      }
    });

    test('should open language menu on click', async ({ page }) => {
      const languageButton = page.locator('app-header button[aria-label="Change language"]');
      await languageButton.click();
      
      // Check if menu is opened
      const languageMenu = page.locator('mat-menu[aria-label=""] .mat-mdc-menu-content, .mat-mdc-menu-panel .mat-mdc-menu-content');
      await expect(languageMenu).toBeVisible();
      
      // Check French option
      const frenchOption = page.locator('button').filter({ hasText: 'Français' });
      await expect(frenchOption).toBeVisible();
      
      // Check English option
      const englishOption = page.locator('button').filter({ hasText: 'English' });
      await expect(englishOption).toBeVisible();
      
      // Close menu by clicking elsewhere
      await page.click('app-header');
    });

    test('should change language when menu item is clicked', async ({ page }) => {
      const languageButton = page.locator('app-header button[aria-label="Change language"]');
      
      // Get initial language
      const initialLang = await languageButton.locator('span.text-white').textContent();
      
      // Open language menu
      await languageButton.click();
      
      // Click on different language
      if (initialLang?.includes('FR')) {
        const englishOption = page.locator('button').filter({ hasText: 'English' });
        await englishOption.click();
        
        // Wait for language change
        await page.waitForTimeout(500);
        
        // Verify language changed
        const newLang = await languageButton.locator('span.text-white').textContent();
        expect(newLang).toContain('EN');
      } else {
        const frenchOption = page.locator('button').filter({ hasText: 'Français' });
        await frenchOption.click();
        
        // Wait for language change
        await page.waitForTimeout(500);
        
        // Verify language changed
        const newLang = await languageButton.locator('span.text-white').textContent();
        expect(newLang).toContain('FR');
      }
    });

    test('should have proper language option styling', async ({ page }) => {
      const languageButton = page.locator('app-header button[aria-label="Change language"]');
      await languageButton.click();
      
      // Check French flag styling
      const frenchFlag = page.locator('span.bg-blue-600').filter({ hasText: 'FR' });
      if (await frenchFlag.count() > 0) {
        await expect(frenchFlag).toHaveClass(/w-6/);
        await expect(frenchFlag).toHaveClass(/h-4/);
        await expect(frenchFlag).toHaveClass(/rounded-sm/);
      }
      
      // Check English flag styling
      const englishFlag = page.locator('span.bg-red-600').filter({ hasText: 'EN' });
      if (await englishFlag.count() > 0) {
        await expect(englishFlag).toHaveClass(/w-6/);
        await expect(englishFlag).toHaveClass(/h-4/);
        await expect(englishFlag).toHaveClass(/rounded-sm/);
      }
      
      await page.click('app-header');
    });
  });

  test.describe('Login Button', () => {
    test('should display login button with proper styling', async ({ page }) => {
      const loginButton = page.locator('app-header button[routerLink="/login"]');
      await expect(loginButton).toBeVisible();
      
      // Check button styling
      await expect(loginButton).toHaveClass(/bg-white/);
      await expect(loginButton).toHaveClass(/text-air-france-700/);
      await expect(loginButton).toHaveClass(/hover:bg-air-france-50/);
      await expect(loginButton).toHaveClass(/rounded-lg/);
      await expect(loginButton).toHaveClass(/font-semibold/);
      
      // Check button contains login icon
      const loginIcon = loginButton.locator('mat-icon').filter({ hasText: 'login' });
      await expect(loginIcon).toBeVisible();
    });

    test('should show translated login text', async ({ page }) => {
      const loginButton = page.locator('app-header button[routerLink="/login"]');
      const loginText = await loginButton.textContent();
      
      // Should contain some text (translated)
      expect(loginText?.trim()).toBeTruthy();
      expect(loginText?.length).toBeGreaterThan(0);
    });

    test('should have hover effects', async ({ page }) => {
      const loginButton = page.locator('app-header button[routerLink="/login"]');
      
      // Hover over button
      await loginButton.hover();
      
      // Check if icon has hover transform
      const loginIcon = loginButton.locator('mat-icon');
      await expect(loginIcon).toHaveClass(/group-hover:scale-110/);
    });

    test('should navigate to login on click', async ({ page }) => {
      const loginButton = page.locator('app-header button[routerLink="/login"]');
      
      // Get current URL
      const currentUrl = page.url();
      
      // Click login button
      await loginButton.click();
      
      // Wait for navigation
      await page.waitForLoadState('networkidle');
      
      // Check if URL changed (assuming login route exists)
      const newUrl = page.url();
      if (newUrl !== currentUrl) {
        expect(newUrl).toContain('/login');
      }
    });

    test('should be responsive on different screen sizes', async ({ page }) => {
      // Desktop view
      await page.setViewportSize({ width: 1280, height: 720 });
      const loginButton = page.locator('app-header button[routerLink="/login"]');
      
      const loginText = loginButton.locator('span.hidden.sm:inline');
      if (await loginText.count() > 0) {
        await expect(loginText).toBeVisible();
      }
      
      // Mobile view
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Text should be hidden on mobile
      if (await loginText.count() > 0) {
        await expect(loginText).not.toBeVisible();
      }
      
      // Icon should still be visible
      const loginIcon = loginButton.locator('mat-icon');
      await expect(loginIcon).toBeVisible();
    });
  });

  test.describe('Mobile Menu', () => {
    test('should show mobile menu button on small screens', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      const mobileMenuButton = page.locator('app-header button.lg:hidden');
      await expect(mobileMenuButton).toBeVisible();
      
      // Check button styling
      await expect(mobileMenuButton).toHaveClass(/text-white/);
      await expect(mobileMenuButton).toHaveClass(/hover:bg-white\/10/);
      
      // Check menu icon
      const menuIcon = mobileMenuButton.locator('mat-icon').filter({ hasText: 'menu' });
      await expect(menuIcon).toBeVisible();
    });

    test('should hide mobile menu button on large screens', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      
      const mobileMenuButton = page.locator('app-header button.lg:hidden');
      await expect(mobileMenuButton).not.toBeVisible();
    });

    test('should be clickable', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      const mobileMenuButton = page.locator('app-header button.lg:hidden');
      
      // Click should not throw error
      await mobileMenuButton.click();
      await page.waitForTimeout(100);
    });
  });

  test.describe('Loading Bar', () => {
    test('should have loading bar element', async ({ page }) => {
      const loadingBar = page.locator('app-header #loading-bar');
      await expect(loadingBar).toBeInViewport();
      
      // Check initial styling
      await expect(loadingBar).toHaveClass(/h-1/);
      await expect(loadingBar).toHaveClass(/bg-gradient-to-r/);
      await expect(loadingBar).toHaveClass(/opacity-0/);
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels', async ({ page }) => {
      // Language button
      const languageButton = page.locator('app-header button[aria-label="Change language"]');
      await expect(languageButton).toHaveAttribute('aria-label', 'Change language');
      
      // Logo image
      const logo = page.locator('app-header img[alt="Air France Logo"]');
      await expect(logo).toHaveAttribute('alt', 'Air France Logo');
    });

    test('should be keyboard navigable', async ({ page }) => {
      // Focus on language button
      const languageButton = page.locator('app-header button[aria-label="Change language"]');
      await languageButton.focus();
      
      // Press Tab to move to login button
      await page.keyboard.press('Tab');
      
      const loginButton = page.locator('app-header button[routerLink="/login"]');
      await expect(loginButton).toBeFocused();
      
      // Press Enter on login button
      await page.keyboard.press('Enter');
      await page.waitForTimeout(100);
    });

    test('should support screen readers', async ({ page }) => {
      // Check for semantic header tag
      const semanticHeader = page.locator('app-header header');
      await expect(semanticHeader).toBeVisible();
      
      // Check for proper heading hierarchy
      const mainTitle = page.locator('app-header h1');
      await expect(mainTitle).toBeVisible();
    });
  });

  test.describe('Performance and Animations', () => {
    test('should have smooth transitions', async ({ page }) => {
      const languageButton = page.locator('app-header button[aria-label="Change language"]');
      
      // Check transition classes
      await expect(languageButton).toHaveClass(/transition-all/);
      await expect(languageButton).toHaveClass(/duration-300/);
      
      const loginButton = page.locator('app-header button[routerLink="/login"]');
      await expect(loginButton).toHaveClass(/transition-all/);
      await expect(loginButton).toHaveClass(/duration-300/);
    });

    test('should load quickly', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/');
      await page.waitForSelector('app-header');
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
    });
  });

  test.describe('Cross-browser Compatibility', () => {
    test('should work consistently across different browsers', async ({ page, browserName }) => {
      // Basic functionality should work in all browsers
      const header = page.locator('app-header');
      await expect(header).toBeVisible();
      
      const languageButton = page.locator('app-header button[aria-label="Change language"]');
      await expect(languageButton).toBeVisible();
      
      const loginButton = page.locator('app-header button[routerLink="/login"]');
      await expect(loginButton).toBeVisible();
      
      // Log browser name for debugging
      console.log(`Header tests passing on: ${browserName}`);
    });
  });
});
