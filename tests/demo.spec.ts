import {test, expect} from '@playwright/test';

// 前置登陆
test.beforeEach(async ({ page }) => {

    // 设置cookie 登陆
    await page.context().addCookies([
        { 
            name: 'wps_sid', 
            value: 'V02SZh2ebON6qooIYzw7OhP542V__J400a3c3b3a0065913297', 
            domain: '.kdocs.cn',
            path: '/',
        },
        { 
            name: 'wps_sid', 
            value: 'V02SZh2ebON6qooIYzw7OhP542V__J400a3c3b3a0065913297', 
            domain: '.wps.cn',
            path: '/',
        }
    ]);
    
    // 等待cookie生效
    await page.waitForTimeout(3000);

     // 跳转URL
    await page.goto('https://365.kdocs.cn/kmwiki');
});

test('test', async ({ page }) => {
 
  await page.getByText('公开知识', { exact: true }).click();
  const page1Promise = page.waitForEvent('popup');
  await page.getByText('天策-运营产品知识库').click();

  const page1 = await page1Promise;
  await page1.locator('.gpt-chat-mobile-header-right > button').first().click();
  await page1.getByRole('button', { name: '快速阅读' }).click();
});