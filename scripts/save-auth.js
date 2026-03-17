/**
 * 登录并保存会话到 auth.json，供后续用例自动带登录态使用。
 * 使用方式：
 *   1. 在 .env 里配置 WPS_SID（从浏览器登录后 F12 -> Application -> Cookies 复制 wps_sid 的值）
 *   2. 执行：npm run auth
 *   3. 之后直接运行用例即可，无需在用例里写登录
 */
const { chromium } = require('playwright');
const path = require('path');

// 加载 .env（可选，没有 .env 时用系统环境变量）
try {
  require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
} catch (_) {
  // 未安装 dotenv 时忽略
}

const WPS_SID = process.env.WPS_SID;
const OUT_PATH = path.resolve(__dirname, '../auth.json');

if (!WPS_SID) {
  console.error('请设置 WPS_SID 环境变量，或在项目根目录 .env 中配置 WPS_SID');
  console.error('获取方式：浏览器登录 365.kdocs.cn 后，F12 -> Application -> Cookies -> 复制 wps_sid 的值');
  process.exit(1);
}

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    locale: 'zh-CN',
    viewport: { width: 1980, height: 1080 },
  });

  await context.addCookies([
    { name: 'wps_sid', value: WPS_SID, domain: '.kdocs.cn', path: '/' },
    { name: 'wps_sid', value: WPS_SID, domain: '.wps.cn', path: '/' },
  ]);

  const page = await context.newPage();
  await page.goto('https://365.kdocs.cn/kmwiki', { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle').catch(() => {});

  await context.storageState({ path: OUT_PATH });
  await browser.close();

  console.log('已保存登录态到:', OUT_PATH);
  console.log('可直接运行用例: npm run test');
})();
