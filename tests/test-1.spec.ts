import { test, expect } from '@playwright/test';

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
  
  await page.getByText('团队文档').nth(1).click();
  await page.locator('span').filter({ hasText: /^智能文档库测试样张库$/ }).click();
  await page.getByRole('button', { name: '智能问答' }).click();
  await page.getByRole('button', { name: '立即切换' }).click();
  await page.getByRole('textbox', { name: '请输入问题，支持@指定文件进行提问' }).click();
  await page.getByText('海华永泰有哪些业务委员会？').click();
  await page.locator('.kd-icon.kd-icon-gesture_thumb > svg').click();


  
});