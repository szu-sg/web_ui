import { describeWithMeta, test, expect, type CaseMeta } from './fixtures/test-meta';

const CASE_META: CaseMeta = {
  priority: 'P0',
  description: '团队考试-新建考试多题型并生成（分步）',
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
    });

    await test.step('添加多题型（单选/判断/填空/简答）', async () => {
      const f = frame();
      await f.getByRole('button', { name: '添加题型' }).click();
      await f.locator('div:nth-child(2) > .exam-menu-item__content > .QuestionType__option-item').first().click();
      await f.getByRole('button', { name: '添加题型' }).click();
      await f.getByText('判断题').first().click();
      await f.getByRole('button', { name: '添加题型' }).click();
      await f.getByText('填空题').first().click();
      await f.getByRole('button', { name: '添加题型' }).click();
      await f.getByText('简答题').first().click();
      await f.getByText('简单考查记忆，题干简洁，单知识点').click();
      await f.getByRole('button', { name: '开始生成' }).click();
    });

    await test.step('等待生成并校验创建考试到表单可见', async () => {
      await page.waitForTimeout(40000);
      await expect(frame().getByRole('button', { name: '创建考试到表单' })).toBeVisible({ timeout: 60000 });
    });
  });
});
