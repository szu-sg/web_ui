import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.baidu.com/');
  await page.locator('#kw').click();
  await page.locator('#kw').fill('西双版纳');
  await page.getByRole('button', { name: '百度一下' }).click();
  await expect(page.getByRole('link', { name: '西双版纳，西双版纳，百度百科' })).toBeVisible();
});