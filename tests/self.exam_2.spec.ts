import { describeWithMeta, test, expect, type CaseMeta } from './fixtures/test-meta';

const CASE_META: CaseMeta = {
  priority: 'P0',
  description: '团队题库-新建题库并创建考试到表单',
  author: '',
  createdAt: '2025-03-17',
};

describeWithMeta(CASE_META, () => {
  test(CASE_META.description, async ({ page }) => {
  await page.goto('https://365.kdocs.cn/wiki/l/0sB3eZVC/qa/');

  await page.getByText('团队考试 限免', { exact: true }).click();

  const frame = page.locator('iframe').nth(1).contentFrame();
  await frame.getByRole('button', { name: '团队题库' }).click();
  await frame.getByRole('button', { name: '新建题库' }).click();
  await frame.getByRole('textbox', { name: '请输入题库名称' }).fill('测试题库');
  await frame.getByRole('button', { name: '确定' }).click();
  await frame.getByText('选择云文档，生成试题').click();
  await frame.getByRole('button', { name: '选择文件' }).click();
  await frame.getByRole('tablist').filter({ hasText: '中国移动_AR行业应用场景及关键技术白皮书_2022 .' }).getByRole('checkbox').click();
  await frame.getByRole('button', { name: '确定', exact: true }).click();
  await frame.getByRole('cell', { name: '1', exact: true }).getByRole('spinbutton').fill('05');
  await frame.getByRole('button', { name: '开始生成' }).click();

  await frame.getByRole('button', { name: '保存到题库' }).waitFor({ state: 'visible', timeout: 60000 });
  await frame.getByRole('button', { name: '保存到题库' }).click();
  await frame.getByRole('button', { name: '发起考试' }).click();
  await frame.getByRole('button', { name: '创建考试' }).click();

  await frame.getByRole('button', { name: '创建考试到表单' }).waitFor({ state: 'visible', timeout: 15000 });
  await frame.getByRole('button', { name: '创建考试到表单' }).click();
  });
});
