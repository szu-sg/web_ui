import { test as base } from '@playwright/test';
import type { Page } from '@playwright/test';

/**
 * 扩展 fixture：提供已登录并打开知识库首页的 page。
 * 依赖全局配置中的 storageState: 'auth.json'，请先通过登录脚本生成 auth.json。
 * 用法：test('用例名', async ({ loggedInPage }) => { ... })，用 loggedInPage 代替 page。
 */
export const test = base.extend<{ loggedInPage: Page }>({
  loggedInPage: async ({ page }, use) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => {});
    await use(page);
  },
});

export { expect } from '@playwright/test';
