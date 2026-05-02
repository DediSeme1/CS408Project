import { test, expect } from '@playwright/test';

test.describe('Coaches', () => {

  // ── List ────────────────────────────────────────────────────
  test('list page loads with table', async ({ page }) => {
    await page.goto('/coaches');
    await expect(page.locator('h2')).toContainText('Coaches');
    await expect(page.locator('table')).toBeVisible();
  });

  test('page title includes CourtOps', async ({ page }) => {
    await page.goto('/coaches');
    await expect(page).toHaveTitle(/CourtOps/);
  });

  // ── Add ─────────────────────────────────────────────────────
  test('add form renders all fields', async ({ page }) => {
    await page.goto('/coaches/add');
    await expect(page.locator('h2')).toContainText('Add New Coach');
    await expect(page.locator('input[name="first_name"]')).toBeVisible();
    await expect(page.locator('input[name="last_name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="phone_number"]')).toBeVisible();
    await expect(page.locator('input[name="speciality"]')).toBeVisible();
  });

  test('shows validation errors when form submitted empty', async ({ page }) => {
    await page.goto('/coaches/add');
    await page.click('button[type="submit"]');
    await expect(page.locator('.alert-danger')).toBeVisible();
  });

  test('successfully adds a coach and redirects to list', async ({ page }) => {
    await page.goto('/coaches/add');
    await page.fill('input[name="first_name"]', 'Test');
    await page.fill('input[name="last_name"]', 'Coach');
    await page.fill('input[name="email"]', 'test.coach@example.com');
    await page.fill('input[name="phone_number"]', '(555) 222-0001');
    await page.fill('input[name="speciality"]', 'Basketball');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/coaches');
    await expect(page.locator('table')).toContainText('Test Coach');
  });

  // ── Detail ───────────────────────────────────────────────────
  test('detail page shows coach information', async ({ page }) => {
    await page.goto('/coaches');
    await page.locator('table a[href^="/coaches/"]').first().click();
    await expect(page.locator('h2')).toBeVisible();
    await expect(page.locator('.card-header')).toContainText('Coach Information');
  });

  // ── Edit ─────────────────────────────────────────────────────
  test('can edit coach information', async ({ page }) => {
    await page.goto('/coaches');
    await page.locator('table a[href^="/coaches/"]').first().click();
    await page.click('a:has-text("Edit Information")');

    await expect(page.locator('input[name="first_name"]')).toBeVisible();
    await page.fill('input[name="phone_number"]', '(555) 999-1234');
    await page.click('button[type="submit"]');

    await expect(page.locator('body')).toContainText('(555) 999-1234');
  });

  // ── Delete ───────────────────────────────────────────────────
  test('can delete a coach from detail page', async ({ page }) => {
    await page.goto('/coaches/add');
    await page.fill('input[name="first_name"]', 'Delete');
    await page.fill('input[name="last_name"]', 'ThisCoach');
    await page.fill('input[name="email"]', 'delete.coach@example.com');
    await page.fill('input[name="phone_number"]', '(555) 000-8888');
    await page.fill('input[name="speciality"]', 'Boxing');
    await page.click('button[type="submit"]');

    await page.goto('/coaches');
    await page.locator('table tbody tr').last().locator('a[href^="/coaches/"]').click();

    page.once('dialog', dialog => dialog.accept());
    await page.click('form[action*="/delete"] button[type="submit"]');

    await expect(page).toHaveURL('/coaches');
  });

  // ── 404 ──────────────────────────────────────────────────────
  test('non-existent coach shows error page', async ({ page }) => {
    await page.goto('/coaches/99999');
    await expect(page.locator('body')).toContainText('not found');
  });

});
