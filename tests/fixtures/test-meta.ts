import { test } from '@playwright/test';

/**
 * 用例基础信息，用于报告与从库拉取后读取（脚本 scripts/collect-case-meta.js 可汇总）
 */
export type CaseMeta = {
  /** 优先级：P0 / P1 / P2 */
  priority: string;
  /** 用例描述（与 test('...') 标题建议一致） */
  description: string;
  /** 编写人 */
  author: string;
  /** 编写时间，建议格式 YYYY-MM-DD */
  createdAt: string;
};

/** 写入当前用例的 annotations，便于报告和平台解析 */
export function setTestMeta(meta: CaseMeta): void {
  const info = test.info();
  info.annotations.push({ type: 'priority', description: meta.priority });
  info.annotations.push({ type: 'description', description: meta.description });
  info.annotations.push({ type: 'author', description: meta.author });
  info.annotations.push({ type: 'createdAt', description: meta.createdAt });
}

/**
 * 带基础信息的 describe：自动打优先级标签（如 @p0）、在 beforeEach 里写入 meta 到 annotations。
 * 用法：
 *   const CASE_META: CaseMeta = { priority: 'P0', description: '...', author: '...', createdAt: '2025-03-17' };
 *   describeWithMeta(CASE_META, () => {
 *     test(CASE_META.description, async ({ page }) => { ... });
 *   });
 */
export function describeWithMeta(meta: CaseMeta, fn: () => void): void {
  const tag = meta.priority.toLowerCase();
  test.describe(`@${tag} ${meta.description}`, () => {
    test.beforeEach(() => setTestMeta(meta));
    fn();
  });
}

export { test, expect } from '@playwright/test';
