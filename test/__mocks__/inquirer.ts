/**
 * inquirer Mock 模块
 * 用于在测试中模拟交互式输入
 * 
 * 使用方式：
 * ```typescript
 * vi.mock("inquirer")
 * import inquirer from "inquirer"
 * 
 * // 设置返回值
 * inquirer.prompt.mockResolvedValue({ bump: "patch", yes: true })
 * ```
 */

import { vi } from "vitest"

// 创建 Mock 函数
const prompt = vi.fn()

// 导出 Mock 实现
export { prompt }

export default {
    prompt,
}

