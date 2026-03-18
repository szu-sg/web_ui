import { describeWithMeta, test, expect, type CaseMeta } from './fixtures/test-meta';

const CASE_META: CaseMeta = {
  priority: 'P0',
  description: '团队题库-新建题库并创建考试到表单（分步）',
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

    await test.step('进入团队题库并新建题库', async () => {
      const f = frame();
      await f.getByRole('button', { name: '团队题库' }).click();
      await f.getByRole('button', { name: '新建题库' }).click();
      await f.getByRole('textbox', { name: '请输入题库名称' }).fill('测试题库');
      await f.getByRole('button', { name: '确定' }).click();
    });

    await test.step('选择文件并生成试题', async () => {
      const f = frame();
      await f.getByText('选择云文档，生成试题').click();
      await f.getByRole('button', { name: '选择文件' }).click();
      await f
        .getByRole('tablist')
        .filter({ hasText: '中国移动_AR行业应用场景及关键技术白皮书_2022 .' })
        .getByRole('checkbox')
        .click();
      await f.getByRole('button', { name: '确定', exact: true }).click();
      await f.getByRole('cell', { name: '1', exact: true }).getByRole('spinbutton').fill('05');
      await f.getByRole('button', { name: '开始生成' }).click();
    });

    await test.step('保存到题库并发起考试', async () => {
      const f = frame();
      await f.getByRole('button', { name: '保存到题库' }).waitFor({ state: 'visible', timeout: 60000 });
      await f.getByRole('button', { name: '保存到题库' }).click();
      await f.getByRole('button', { name: '发起考试' }).click();
      await f.getByRole('button', { name: '创建考试' }).click();
    });

    await test.step('创建考试到表单', async () => {
      const f = frame();
      await f.getByRole('button', { name: '创建考试到表单' }).waitFor({ state: 'visible', timeout: 15000 });
      await f.getByRole('button', { name: '创建考试到表单' }).click();
    });
  });
});
