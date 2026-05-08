import { test, expect } from '@playwright/test';

test.describe('Members', () => {

  //  List
  test('list page loads with table', async ({ page }) => {
    await page.goto('/members');
    await expect(page.locator('h2')).toContainText('Members');
    await expect(page.locator('table')).toBeVisible();
  });

  test('page title includes CourtOps', async ({ page }) => {
    await page.goto('/members');
    await expect(page).toHaveTitle(/CourtOps/);
  });

  //  Add 
  test('add form renders all fields', async ({ page }) => {
    await page.goto('/members/add');
    await expect(page.locator('h2')).toContainText('Add New Member');
    await expect(page.locator('input[name="first_name"]')).toBeVisible();
    await expect(page.locator('input[name="last_name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="phone_number"]')).toBeVisible();
    await expect(page.locator('select[name="status"]')).toBeVisible();
  });

  test('shows validation errors when form submitted empty', async ({ page }) => {
    await page.goto('/members/add');
    await page.click('button[type="submit"]');
    await expect(page.locator('.alert-danger')).toBeVisible();
  });

  test('successfully adds a member and redirects to list', async ({ page }) => {
    await page.goto('/members/add');
    await page.fill('input[name="first_name"]', 'Test');
    await page.fill('input[name="last_name"]', 'Member');
    await page.fill('input[name="email"]', 'test.member@example.com');
    await page.fill('input[name="phone_number"]', '(555) 111-0001');
    await page.selectOption('select[name="status"]', 'Active');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/members');
    await expect(page.locator('table')).toContainText('Test Member');
  });

  // Detail 
  test('detail page shows member information', async ({ page }) => {
    await page.goto('/members');
    await page.locator('table a[href^="/members/"]').first().click();
    await expect(page.locator('h2')).toBeVisible();
    await expect(page.locator('.card-header')).toContainText('Member Information');
  });

  // Status Update 
  test('can update membership status', async ({ page }) => {
    await page.goto('/members');
    await page.locator('table a[href^="/members/"]').first().click();
    const url = page.url();

    await page.selectOption('select[name="status"]', 'Inactive');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(url);
    await expect(page.locator('.badge.fs-6')).toContainText('Inactive');
  });

  // Delete 
  test('can delete a member from detail page', async ({ page }) => {
    // Add a member specifically to delete
    await page.goto('/members/add');
    await page.fill('input[name="first_name"]', 'Delete');
    await page.fill('input[name="last_name"]', 'MePlease');
    await page.fill('input[name="email"]', 'deleteme@example.com');
    await page.fill('input[name="phone_number"]', '(555) 000-9999');
    await page.selectOption('select[name="status"]', 'Active');
    await page.click('button[type="submit"]');

    await page.goto('/members');
    await page.locator('table tbody tr').last().locator('a[href^="/members/"]').click();

    page.once('dialog', dialog => dialog.accept());
    await page.click('form[action*="/delete"] button[type="submit"]');

    await expect(page).toHaveURL('/members');
  });

  // 404 
  test('non-existent member shows error page', async ({ page }) => {
    await page.goto('/members/99999');
    await expect(page.locator('body')).toContainText('not found');
  });

});