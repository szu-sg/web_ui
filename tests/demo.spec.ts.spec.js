const { test, expect } = require('@playwright/test');
const { locators } = require('../globalLocators.js');


test(`demo`, async ({ browser }) => {
    const context = await browser.newContext();
    const page1 = await context.newPage();
    await page1.goto('https://365.kdocs.cn/kmwiki');
    await page1.close();
});  await page2.close();
    await page1.close();
    await page3.close();
    await page1.close();
    await page2.close();
    await page1.close();
    await page1.close();
    await page1.close();
    await page1.close();
    await page1.close();
  