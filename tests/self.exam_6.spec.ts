import { describeWithMeta, test, expect, type CaseMeta } from './fixtures/test-meta';

const CASE_META: CaseMeta = {
  priority: 'P0',
  description: '团队考试-新建考试并发布到表单（分步）',
  author: '',
  createdAt: '2025-03-18',
};

describeWithMeta(CASE_META, () => {
  test(CASE_META.description, async ({ page }) => {
    const frame = () => page.locator('iframe').nth(1).contentFrame()!;

    await test.step('打开页面并进入团队考试', async () => {
      await page.goto('https://365.kdocs.cn/wiki/l/0sB3eZVC/qa/');
      await page.getByText('团队考试 限免', { exact: true }).click();
    });

    await test.step('新建考试并选择云文档', async () => {
      const f = frame();
      await f.getByRole('button', { name: '新建考试' }).click();
      await f.getByText('选择云文档，生成试题').click();
      await f
        .getByRole('tablist')
        .filter({ hasText: '中国移动_AR行业应用场景及关键技术白皮书_2022 .' })
        .getByRole('checkbox')
        .click();
      await f
        .getByRole('tablist')
        .filter({ hasText: '中国虚拟现实应用状况 .pdf' })
        .getByRole('checkbox')
        .click();
      await f.getByRole('button', { name: '确定', exact: true }).click();
      await f.getByRole('cell', { name: '1', exact: true }).getByRole('spinbutton').fill('05');
      await f.getByRole('button', { name: '开始生成' }).click();
    });

    await test.step('等待生成完成', async () => {
      await page.waitForTimeout(40000);
      await frame().getByRole('button', { name: '创建考试到表单' }).waitFor({ state: 'visible', timeout: 60000 });
    });

    await test.step('创建考试到表单并发布', async () => {
      const page1Promise = page.waitForEvent('popup');
      await frame().getByRole('button', { name: '创建考试到表单' }).click();
      const page1 = await page1Promise;
      await page1.getByRole('button', { name: 'Close' }).click();
      await page1.getByRole('button', { name: '发布并分享' }).click();
    });
  });
});
