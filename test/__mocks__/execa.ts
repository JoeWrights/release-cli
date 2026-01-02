/**
 * execa Mock 模块
 * 用于在测试中模拟命令行执行
 * 
 * 使用方式：
 * ```typescript
 * vi.mock("execa")
 * import execa from "execa"
 * 
 * // 设置返回值
 * execa.commandSync.mockReturnValue({ stdout: "main" })
 * ```
 */

import { vi } from "vitest"

// 创建 Mock 函数
const commandSync = vi.fn()
const command = vi.fn()

// 导出 Mock 实现
export { commandSync, command }

export default {
    commandSync,
    command,
}

