import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'fs';
import { resolve } from 'path';

// 登录态：优先用环境变量 AUTH_FILE，否则用项目根目录的 auth.json（勿在用例中写登录信息）
const authFile = resolve(__dirname, process.env.AUTH_FILE || 'auth.json');

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  timeout: 600000, // 单条用例超时 10 分钟
  retries: process.env.CI ? 2 : 0,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [['html'], ['junit', { outputFile: 'test-results/junit.xml' }]] : 'html',
  use: {
    baseURL: 'https://365.kdocs.cn/kmwiki',
    storageState: existsSync(authFile) ? authFile : undefined,
    headless: false,
    viewport: { width: 1980, height: 1080 },
    locale: 'zh-CN',
    acceptDownloads: true,
    screenshot: 'on',
    video: 'on',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
