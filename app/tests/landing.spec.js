import { test, expect } from '@playwright/test';
 
test.describe('Landing Page', () => {
  test('displays the landing page with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/CourtOps/);
    await expect(page.locator('h1')).toContainText('Welcome to CourtOps');
  });
 
  test('shows stats on the landing page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Active Members')).toBeVisible();
    await expect(page.locator('text=Total Coaches')).toBeVisible();
    await expect(page.locator('text=Weekly Classes')).toBeVisible();
  });
 
  test('has navigation links to members, coaches, and classes', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav a[href="/members"]')).toBeVisible();
    await expect(page.locator('nav a[href="/coaches"]')).toBeVisible();
    await expect(page.locator('nav a[href="/classes"]')).toBeVisible();
  });
 
  test('View All Members button navigates correctly', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/members"]');
    await expect(page).toHaveURL('/members');
  });
 
  test('View All Coaches button navigates correctly', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/coaches"]');
    await expect(page).toHaveURL('/coaches');
  });
 
  test('View All Classes button navigates correctly', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/classes"]');
    await expect(page).toHaveURL('/classes');
  });
});

