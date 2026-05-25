import { test, expect } from '@playwright/test';

// Zero-Trust Alignment: Use anonymized mock data
const MOCK_USER = {
  email: 'nurse.demo@hospital.org',
  password: 'SecurePassword123!',
};

test.describe('Authentication and Dashboard Flow', () => {
  test('User can log in and view dashboard', async ({ page }) => {
    // Navigate to login
    await page.goto('/login');
    
    // Expect login page title/heading
    await expect(page.locator('h1')).toContainText('Welcome Back');
    
    // Fill login form
    await page.fill('input[type="email"]', MOCK_USER.email);
    await page.fill('input[type="password"]', MOCK_USER.password);
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for navigation to dashboard
    await page.waitForURL('/dashboard');
    
    // Check dashboard rendering
    await expect(page.locator('h1')).toContainText('Dashboard', { timeout: 10000 });
    
    // Verify specific dashboard components are visible (e.g. Profile Customization, Metrics)
    await expect(page.getByText('Profile Customization')).toBeVisible();
    await expect(page.getByText('Your Metrics')).toBeVisible();
    
    // Verify anonymized/mock Identity info
    await expect(page.getByText('Professional Identity')).toBeVisible();
  });
  
  test('Dashboard enforces authentication', async ({ page }) => {
    // Attempting to go directly to dashboard without login should redirect
    await page.goto('/dashboard');
    
    // Should be redirected to login
    await expect(page).toHaveURL(/.*\/login/);
  });
});
