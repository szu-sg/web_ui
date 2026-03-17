# web_ui - 团队自动化用例仓库

用于存储团队 Web UI 自动化用例，配合用例管理平台（如 AlphaBin 等）执行用例。

## 技术栈

- **Playwright** + TypeScript
- **alphabin-pw**：与用例管理平台集成
- 主要被测系统：金山文档知识库 (365.kdocs.cn/kmwiki)

## 项目结构

```
web_ui/
├── playwright.config.ts   # Playwright 主配置
├── .env.example           # 环境变量示例（复制为 .env 后填写，勿提交 .env）
├── scripts/save-auth.js   # 登录脚本，npm run auth 生成 auth.json
├── auth.json              # 登录态（未提交，由登录脚本生成）
├── globalLocators.js      # 全局定位器（当前未使用）
├── pages/
│   └── main.ts            # 页面对象（当前为空）
└── tests/
    ├── fixtures/base.ts   # 公共 fixture（如 loggedInPage）
    ├── demo.spec.ts       # 公开知识 / 快速阅读
    ├── example.spec.ts    # Playwright 官方示例
    ├── self.exam.spec.ts  # 知识库自我测验
    ├── test-1.spec.ts     # 团队文档 / 智能问答
    ├── test-2~7.spec.ts   # 部分为占位/录制骨架
    └── test-3.spec.ts     # 百度搜索示例
```

## 登录与环境变量（重要）

**约定：登录信息不要写在用例里，一律用环境变量 + auth.json。**

| 内容 | 放哪里 | 说明 |
|------|--------|------|
| 账号、密码、Cookie、Token | **环境变量**（如 `.env` 或 CI 里配置） | 仅给「登录脚本」用，用例代码不读取、不写死 |
| 登录后的会话 | **auth.json** | 由登录脚本根据环境变量完成一次登录后保存；用例通过 `storageState` 自动加载 |
| auth 文件路径 | 环境变量 **AUTH_FILE**（可选） | 默认用项目根目录 `auth.json`；CI 或多环境时可设为不同路径 |

**推荐流程：**

1. 复制 `.env.example` 为 `.env`，在 `.env` 里填登录相关变量（如 `WPS_SID` 等，仅给脚本用）。
2. 运行项目自带的登录脚本生成 `auth.json`：在 `.env` 里配置好 `WPS_SID` 后执行 `npm run auth`（见下方「先登录再跑用例」）。
3. 用例里**只写业务步骤**，不出现任何登录逻辑；需要登录的用例依赖配置里的 `storageState`（即 auth.json）即可。

这样既避免敏感信息进仓库，也便于不同环境（本地 / 平台 / 多账号）用不同 `.env` 或 CI 变量。

### 先登录再跑用例（操作步骤）

录制的用例（如「知识库自我测验」）需要已登录状态，按下面做一次即可，之后直接跑用例就会自动带登录态：

1. **拿到 Cookie**  
   浏览器打开 [365.kdocs.cn](https://365.kdocs.cn) 并登录 → 按 F12 → Application（应用）→ Cookies → 选中 `https://365.kdocs.cn` → 找到 `wps_sid`，复制其**值**。

2. **配置到本地**  
   项目根目录复制 `.env.example` 为 `.env`，在 `.env` 里写一行（把下面的值换成你复制的）：  
   `WPS_SID=你复制的wps_sid值`

3. **生成登录态**  
   在项目根目录执行：  
   `npm run auth`  
   会打开浏览器并访问知识库，然后自动把会话保存到 `auth.json`。

4. **跑用例**  
   之后直接运行用例即可（包括录制的 self.exam 等），无需在用例里写登录：  
   `npm run test`  
   或只跑单个：  
   `npx playwright test self.exam.spec.ts`

登录过期时重新执行第 3 步即可。

## 用例基础信息（优先级、描述、编写人、时间）

用例统一通过 **CASE_META** 声明基础信息，便于报告展示和从库拉取后读取：

| 字段 | 说明 |
|------|------|
| priority | 优先级：P0 / P1 / P2 |
| description | 用例描述（与 test 标题一致即可） |
| author | 编写人 |
| createdAt | 编写时间，建议 YYYY-MM-DD |

**写法**（使用 `tests/fixtures/test-meta.ts` 的 `describeWithMeta`）：

```ts
import { describeWithMeta, test, expect, type CaseMeta } from './fixtures/test-meta';

const CASE_META: CaseMeta = {
  priority: 'P0',
  description: '团队考试-新建考试并发布到表单',
  author: '张三',
  createdAt: '2025-03-17',
};

describeWithMeta(CASE_META, () => {
  test(CASE_META.description, async ({ page }) => {
    // 用例步骤...
  });
});
```

- **报告**：运行用例时，上述信息会写入 Playwright 的 annotations，在 HTML 报告中可见。
- **从库拉取后读取**：在项目根目录执行  
  `npm run meta`（输出到终端）或 `npm run meta:json`（输出到 `case-meta.json`），  
  会扫描所有 `**/*.spec.ts` 中的 `CASE_META` 并汇总为 JSON，便于脚本或平台解析。

## 用例优先级标签

带 CASE_META 的用例会自动打 `@p0` / `@p1` / `@p2` 标签（由 priority 决定），便于按优先级执行：

| 标签 | 说明 | 只跑该优先级 |
|------|------|----------------|
| @p0  | 核心用例 | `npm run test:p0` 或 `npx playwright test --grep @p0` |
| @p1  | 重要用例 | `npx playwright test --grep @p1` |
| @p2  | 一般用例 | `npx playwright test --grep @p2` |

## 当前运行方式

- 用例目录：`./tests`，匹配 `**/*.spec.ts`
- 默认：Chromium、有头、中文、1980x1080、baseURL；若存在 `auth.json` 或 `AUTH_FILE` 指定文件则自动作为 storageState
- 知识库相关用例使用 `tests/fixtures/base.ts` 的 `loggedInPage` 前置打开首页

## 录制新用例

1. **确保已有登录态**  
   若录制的场景需要登录，先执行一次 `npm run auth` 生成 `auth.json`。

2. **启动录制（带登录态）**  
   在项目根目录执行：
   ```bash
   npm run record
   ```
   会打开浏览器并**自动带上 auth.json 的登录态**，从知识库首页 `https://365.kdocs.cn/kmwiki` 开始。你在浏览器里的操作会被录成代码，显示在 Playwright 的录制窗口里。

3. **从空白页录制**  
   若用例不依赖知识库登录（例如测百度、其他站），可执行：
   ```bash
   npm run record:blank
   ```
   从空白页开始，自己输入 URL 再操作。

4. **保存为用例文件**  
   - 在录制窗口里点击 **Copy** 复制生成的代码。  
   - 在项目里新建文件 `tests/你的用例名.spec.ts`（文件名必须以 `.spec.ts` 结尾）。  
   - 粘贴代码，把开头的 `test('...', ...)` 改成有意义的用例名，例如 `test('知识库某某功能', async ({ page }) => { ... })`。  
   - 若该用例是从知识库首页开始的一条龙操作，可改为使用 fixture：把 `import { test, expect } from '@playwright/test'` 改成 `import { test, expect } from './fixtures/base'`，并把参数 `{ page }` 改成 `{ loggedInPage: page }`，可去掉录制里重复的「打开首页」步骤。

5. **运行新用例**  
   ```bash
   npx playwright test 你的用例名.spec.ts
   ```

### 使用 Playwright 插件录制（VS Code / Cursor）

1. **安装插件**  
   在 Cursor/VS Code 里安装 **Playwright Test for VS Code**（Microsoft 官方）。

2. **新建用例文件**  
   在 `tests/` 下新建一个空文件，例如 `tests/我的新用例.spec.ts`（文件名必须以 **`.spec.ts`** 结尾，否则不会被 `npm run test` 识别）。

3. **用插件开始录制**  
   - 打开刚建的 `xxx.spec.ts`，把光标放在文件里。  
   - 在侧边栏点 **Testing**（试管图标），或命令面板里搜 **Playwright: Record New**。  
   - 选 **Record New**：会打开浏览器并开始录；选 **Record at cursor**：会在当前光标位置插入录制。  
   - 插件一般会使用项目里的 `playwright.config.ts`，若根目录已有 **auth.json**，打开的浏览器通常会**自动带登录态**；若没有，需要先在浏览器里手动登录再操作，或先执行 `npm run auth` 再录。

4. **操作并保存**  
   在浏览器里按实际流程操作，插件会把步骤生成到 `xxx.spec.ts`。录完后保存文件，把自动生成的 `test('test', ...)` 里的标题改成有意义的用例名。

5. **运行**  
   在插件里点用例旁的运行按钮，或终端执行：  
   `npx playwright test 我的新用例.spec.ts`

**提示**：若录的是「从知识库首页开始」的流程，可把生成的 `import { test, expect } from '@playwright/test'` 改为 `import { test, expect } from './fixtures/base'`，并把 `test('xxx', async ({ page }) => {` 改为 `test('xxx', async ({ loggedInPage: page }) => {`，这样跑用例时会自动先打开首页，可删掉录制里重复的「打开首页」步骤。

**为什么插件没有录制快捷键？**  
Playwright 官方插件默认没有给「Record New」分配快捷键。本项目在 `.vscode/keybindings.json` 里加了建议快捷键（**Ctrl+Alt+R** 录制新用例、**Ctrl+Shift+Alt+R** 在当前光标处录制）；若不起作用，可自己绑一次：

1. 按 **Ctrl+K** 再按 **Ctrl+S** 打开「键盘快捷方式」。
2. 搜索 **Playwright** 或 **Record**。
3. 找到 **Record New**（或「录制新测试」）、**Record at cursor**（或「在光标处录制」），点击左侧的 **+** 或铅笔图标，按下你想要的组合键（如 **Ctrl+Alt+R**）保存即可。

---

## 优化建议

### 1. 统一 Playwright 配置（高优先级）

- **问题**：存在 `playwright.config.ts` 和 `playwright.config.js` 两套配置，且内容不一致（baseURL、storageState、workers、retries 等）。
- **建议**：
  - 只保留一份配置（推荐 `playwright.config.ts`），删除或重命名 `playwright.config.js`。
  - 若平台只认 `.js`，可在 `package.json` 里用 `PLAYWRIGHT_CONFIG_FILE=playwright.config.ts` 或把 TS 编译成单一入口后指定。

### 2. 用例文件匹配规则（高优先级）

- **问题**：`testMatch: '**/*.ts'` 会执行 `tests/` 下所有 `.ts` 文件，容易误跑非用例文件。
- **建议**：改为只跑用例文件，例如：
  - `testMatch: '**/*.spec.ts'` 或
  - `testMatch: ['**/*.spec.ts', '**/*.test.ts']`
- 同步把 `self.exam.ts` 重命名为 `self.exam.spec.ts`，便于与约定一致。

### 3. 登录与鉴权统一（高优先级 + 安全）

- **问题**：
  - 配置里使用了 `storageState: 'auth.json'`，但 test-1、demo、self.exam 等又在 `beforeEach` 里写死 Cookie。
  - Cookie 明文写在代码里，存在泄露和过期维护成本。
- **建议**：
  - **方案 A**：全部改用 `auth.json`。用一次登录脚本生成 `auth.json`，各用例不再在用例里写 Cookie；从 `.gitignore` 确认 `auth.json` 已忽略。
  - **方案 B**：若平台必须用 Cookie，则把 Cookie 放到环境变量或本地加密配置中，在 `globalSetup` 或 `fixture` 里统一注入，用例内不出现具体 Cookie 值。
  - 删除各文件内重复的 Cookie 设置代码，避免同一项目里“一部分用 auth.json、一部分用 Cookie”的混用。

### 4. 去掉固定等待，提升稳定性

- **问题**：`await page.waitForTimeout(3000)` 依赖固定时间，环境慢时仍可能失败，环境快时浪费 3 秒。
- **建议**：改为基于状态的等待，例如：
  - `await page.waitForLoadState('networkidle')` 或
  - `await page.goto(..., { waitUntil: 'domcontentloaded' })` 再 `await expect(某个已登录才有的元素).toBeVisible()`。

### 5. 为 package.json 增加脚本（便于本地与平台执行）

- **问题**：`package.json` 中 `scripts` 为空，不便于统一执行入口。
- **建议**：至少增加：
  - `"test": "playwright test"`
  - `"test:headed": "playwright test --headed"`
  - `"test:ui": "playwright test --ui"`
  - 若平台需要指定配置：`"test:ci": "playwright test --config=playwright.config.ts"`
  平台拉取代码后可直接执行 `npm run test` 或 `npm run test:ci`。

### 6. 用例命名与空用例整理（中优先级）

- **问题**：多处用例标题为 `test('test', ...)`，不利于在用例管理平台中识别；test-2、test-4、test-5、test-6、test-7 仅为 “// Recording...” 占位。
- **建议**：
  - 为每个用例起语义化标题，如：`test('进入团队文档并打开智能问答', ...)`。
  - 占位用例：要么补充实现，要么删除或加上 `test.skip`，避免被平台误执行。

### 7. 抽离公共登录/前置（中优先级）

- **问题**：登录与跳转 baseURL 在多个 spec 中复制粘贴，修改时要改多处。
- **建议**：
  - 使用 Playwright 的 **fixture 扩展** 或 **globalSetup**，在项目根目录增加 `global-setup.ts` 或 `fixtures/base.ts`，在其中完成 Cookie 注入或依赖 `auth.json` 的检查；各用例只写业务步骤。
  - 这样与用例管理平台“按用例执行”的模式兼容：平台仍可单用例、多用例、全量执行。

### 8. 与用例管理平台对接（按平台能力选做）

- **报告**：若平台需要标准报告，可在 `playwright.config.ts` 中增加 reporter，例如：
  - `reporter: [['html'], ['junit', { outputFile: 'test-results/junit.xml' }]]`，便于平台解析。
- **环境与账号**：通过环境变量区分环境（如 BASE_URL、AUTH_FILE），便于平台在不同环境下发不同参数。
- **用例标识**：若平台支持通过 tag/group 挑选用例，可在用例上使用 `test.describe()` 或 `@tag`（如 `test.describe('知识库 @smoke')`），在配置里用 `grep` 或 `project` 按 tag 过滤。

### 9. 可选：Page Object 与 globalLocators

- **问题**：`pages/main.ts` 为空，`globalLocators.js` 仅导出空对象，公共选择器分散在各用例中。
- **建议**：若用例继续增多，可逐步：
  - 把 kmwiki 典型页面（如团队文档、智能问答、自我测验）抽象成 Page Object，放在 `pages/` 下。
  - 把通用选择器（如主导航、通用按钮）放进 `globalLocators.js` 或在 Page 中复用，减少重复与因 UI 变更导致的大范围修改。

### 10. .gitignore 与敏感文件

- **建议**：确认以下已加入 `.gitignore`：`auth.json`、`debug.log`。若 `.vscode/` 含本地路径等敏感信息，可考虑一并忽略或只提交通用配置。

---

## 建议执行顺序

1. 统一配置：只保留一份 Playwright 配置，并修正 `testMatch`。
2. 统一鉴权：选定 auth.json 或环境变量 Cookie，删除用例内硬编码 Cookie。
3. 为 package.json 添加 `test` / `test:ci` 等脚本，方便平台调用。
4. 整理占位用例、用例标题，并视需要增加 JUnit 等 reporter 与 tag，便于平台集成。

完成以上几步后，仓库会更适合作为“用例存储 + 平台执行”的单一事实来源，维护成本和执行稳定性都会更好。
