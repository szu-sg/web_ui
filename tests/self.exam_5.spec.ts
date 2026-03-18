import { describeWithMeta, test, expect, type CaseMeta } from './fixtures/test-meta';

const CASE_META: CaseMeta = {
  priority: 'P0',
  description: '知识库自我测验功能（分步）',
  author: '',
  createdAt: '2025-03-18',
};

describeWithMeta(CASE_META, () => {
  test(CASE_META.description, async ({ page }) => {
    await test.step('打开知识库测验页', async () => {
      await page.goto('https://365.kdocs.cn/wiki/l/0sB3eZVC/qa/');
    });

    await test.step('进入自我测验并选择云文档出题', async () => {
      await page.locator('div:nth-child(3) > .item-title').click();
      await page.getByText('选择云文档，生成试题最多 10').click();
    });

    await test.step('勾选文档并确定', async () => {
      await page
        .getByRole('tablist')
        .filter({ hasText: '中国虚拟现实应用状况 .pdf' })
        .getByRole('checkbox')
        .click();
      await page
        .getByRole('tablist')
        .filter({ hasText: '虛擬實境技術於工程實務之應用 .pdf' })
        .getByRole('checkbox')
        .click();
      await page.getByRole('button', { name: '确定', exact: true }).click();
      await page.getByRole('button', { name: '开始生成' }).click();
    });

    await test.step('等待出题完成', async () => {
      await page.waitForTimeout(40000);
    });

    await test.step('逐题作答直至完成测验', async () => {
      while (true) {
        await page.getByText('A.').first().click();
        await page.waitForTimeout(300);
        const finishBtn = page.getByRole('button', { name: '完成测验' });
        if (await finishBtn.isVisible()) {
          await finishBtn.click();
          break;
        }
        const nextBtn = page.getByRole('button', { name: '下一题' });
        if (await nextBtn.isVisible()) {
          await nextBtn.click();
          await page.waitForTimeout(500);
        } else {
          break;
        }
      }
    });

    await test.step('导出试题至表单并发布', async () => {
      const page2Promise = page.waitForEvent('popup');
      await page.getByRole('button', { name: '导出试题至表单' }).click();
      const page2 = await page2Promise;
      await page2.getByRole('button', { name: 'Close' }).click();
      await page2.getByRole('button', { name: '发布并分享' }).click();
    });
  });
});
