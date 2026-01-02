# 测试设置说明

## 推荐测试框架：Vitest

本项目推荐使用 **Vitest** 作为测试框架，原因：
- ✅ 原生 TypeScript 支持，无需额外配置
- ✅ 快速，使用 Vite 的转换
- ✅ 体积小，适合 CLI 工具
- ✅ 内置 Mock 功能
- ✅ API 与 Jest 相似，学习成本低

## 安装

```bash
pnpm add -D vitest @vitest/ui
```

## 配置

由于项目使用 CommonJS，需要在 `package.json` 中添加 Vitest 配置：

```json
{
  "vitest": {
    "test": {
      "environment": "node",
      "globals": true,
      "include": ["src/**/*.{test,spec}.{js,ts}"],
      "exclude": ["node_modules", "lib"],
      "testTimeout": 10000
    }
  }
}
```

或者创建 `vitest.config.mjs` 文件（使用 ESM 格式）。

## 测试脚本

已在 `package.json` 中添加：
- `pnpm test` - 运行测试（watch 模式）
- `pnpm test:run` - 运行测试（单次）
- `pnpm test:ui` - 使用 UI 界面运行测试
- `pnpm test:coverage` - 生成覆盖率报告

## 测试示例

已创建以下测试文件作为示例：
- `src/config.test.ts` - 配置验证测试
- `src/utils.test.ts` - 工具函数测试

## Mock 示例

已创建 Mock 文件：
- `src/__mocks__/execa.ts` - Mock execa（Git 命令）
- `src/__mocks__/inquirer.ts` - Mock inquirer（交互式输入）

## 注意事项

如果遇到 ESM/CommonJS 兼容性问题，可以考虑：
1. 使用 `vitest.config.mjs` 而不是 `.ts`
2. 在 `package.json` 中配置而不是使用配置文件
3. 或者使用 Jest（更适合 CommonJS 项目）

