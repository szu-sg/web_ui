import { describeWithMeta, test, expect, type CaseMeta } from './fixtures/test-meta';

const CASE_META: CaseMeta = {
  priority: 'P0',
  description: '知识库自我测验功能',
  author: '',
  createdAt: '2025-03-17',
};

describeWithMeta(CASE_META, () => {
  test(CASE_META.description, async ({ page }) => {
  await page.goto('https://365.kdocs.cn/wiki/l/0sB3eZVC/qa/');

  await page.locator('div:nth-child(3) > .item-title').click();
  await page.getByText('选择云文档，生成试题最多 10').click();

  await page.getByRole('tablist').filter({ hasText: '中国虚拟现实应用状况 .pdf' }).getByRole('checkbox').click();
  await page.getByRole('tablist').filter({ hasText: '虛擬實境技術於工程實務之應用 .pdf' }).getByRole('checkbox').click();

  await page.getByRole('button', { name: '确定', exact: true }).click();
  await page.getByRole('button', { name: '开始生成' }).click();

  // 等待出题完成（可能出现「下一题」或直接是最后一题「完成测验」）
  await page.waitForTimeout(40000);

  // 按实际题目数量循环：每题选 A，有「下一题」就点，出现「完成测验」就点并结束
  while (true) {
    await page.getByText('A.').first().click();
    await page.waitForTimeout(300); // 等选项选中生效
    const finishBtn = page.getByRole('button', { name: '完成测验' });
    if (await finishBtn.isVisible()) {
      await finishBtn.click();
      break;
    }
    const nextBtn = page.getByRole('button', { name: '下一题' });
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await page.waitForTimeout(500); // 等下一题渲染完成再继续
    } else {
      break;
    }
  }

  const page2Promise = page.waitForEvent('popup');
  await page.getByRole('button', { name: '导出试题至表单' }).click();
  const page2 = await page2Promise;

  await page2.getByRole('button', { name: 'Close' }).click();
  await page2.getByRole('button', { name: '发布并分享' }).click();
  });
});
