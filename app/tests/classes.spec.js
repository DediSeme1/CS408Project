import { test, expect } from '@playwright/test';

// ── Class List ────────────────────────────────────────────────
test('classes list page loads', async ({ page }) => {
  await page.goto('/classes');
  await expect(page.locator('h2')).toContainText('Classes');
  await expect(page.locator('table')).toBeVisible();
});

test('has an Add Class button', async ({ page }) => {
  await page.goto('/classes');
  await page.click('a[href="/classes/add"]');
  await expect(page).toHaveURL('/classes/add');
});

// ── Add Class ─────────────────────────────────────────────────
test('add class form renders', async ({ page }) => {
  await page.goto('/classes/add');
  await expect(page.locator('h2')).toContainText('Add New Class');
  await expect(page.locator('input[name="class_name"]')).toBeVisible();
  await expect(page.locator('select[name="coach"]')).toBeVisible();
  await expect(page.locator('input[name="class_date"]')).toBeVisible();
  await expect(page.locator('input[name="class_time"]')).toBeVisible();
  await expect(page.locator('input[name="capacity"]')).toBeVisible();
});

test('shows errors when add class form submitted empty', async ({ page }) => {
  await page.goto('/classes/add');
  await page.click('button[type="submit"]');
  await expect(page.locator('.alert-danger')).toBeVisible();
});

test('successfully adds a class', async ({ page }) => {
  await page.goto('/classes/add');
  await page.fill('input[name="class_name"]', 'Test Class');
  await page.locator('select[name="coach"]').selectOption({ index: 1 });
  await page.fill('input[name="class_date"]', '2026-06-01');
  await page.fill('input[name="class_time"]', '09:00');
  await page.fill('input[name="capacity"]', '10');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('/classes');
  await expect(page.locator('table')).toContainText('Test Class');
});

// ── Class Detail ──────────────────────────────────────────────
test('class detail page loads', async ({ page }) => {
  await page.goto('/classes');
  await page.locator('table a[href^="/classes/"]').first().click();
  await expect(page.locator('h2')).toBeVisible();
  await expect(page.locator('text=Class Information')).toBeVisible();
});

// ── Edit Class ────────────────────────────────────────────────
test('can edit class information', async ({ page }) => {
  await page.goto('/classes');
  await page.locator('table a[href^="/classes/"]').first().click();

  await page.click('a:has-text("Edit Information")');
  await expect(page.locator('input[name="class_name"]')).toBeVisible();

  await page.fill('input[name="capacity"]', '20');
  await page.click('button[type="submit"]');

  await expect(page.locator('body')).toContainText('20');
});

// ── Delete Class ──────────────────────────────────────────────
test('can delete a class', async ({ page }) => {
  // Add a class to delete
  await page.goto('/classes/add');
  await page.fill('input[name="class_name"]', 'Delete This Class');
  await page.locator('select[name="coach"]').selectOption({ index: 1 });
  await page.fill('input[name="class_date"]', '2026-07-01');
  await page.fill('input[name="class_time"]', '10:00');
  await page.fill('input[name="capacity"]', '5');
  await page.click('button[type="submit"]');

  // Go to its detail page
  await page.goto('/classes');
  await page.locator('table tbody tr').last().locator('a[href^="/classes/"]').click();

  // Delete
  page.once('dialog', dialog => dialog.accept());
  await page.click('form[action*="/delete"] button[type="submit"]');

  await expect(page).toHaveURL('/classes');
});

// ── 404 ───────────────────────────────────────────────────────
test('non-existent class shows error', async ({ page }) => {
  await page.goto('/classes/99999');
  await expect(page.locator('body')).toContainText('not found');
});