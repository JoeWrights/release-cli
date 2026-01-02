# Mock 文件使用说明

## `__mocks__` 文件夹的作用

`__mocks__` 文件夹是 Vitest/Jest 的特殊文件夹，用于存放模块的 Mock 实现。

### 工作原理

当你在测试文件中使用 `vi.mock('module-name')` 时，Vitest 会：
1. 首先查找 `__mocks__/module-name.ts` 文件
2. 如果找到，使用该文件作为 Mock 实现
3. 如果没有找到，会创建一个自动 Mock

### 当前项目中的 Mock 文件

#### 1. `__mocks__/execa.ts`
用于 Mock `execa` 模块（执行命令行命令）

**使用方式：**
```typescript
import { vi } from "vitest"
import execa from "execa"

// 启用 Mock
vi.mock("execa")

// 现在 execa 已经被 Mock，可以设置返回值
const mockExeca = execa as any

// 设置 commandSync 的返回值
mockExeca.commandSync.mockReturnValue({
    stdout: "main"
})

// 或者让它抛出错误
mockExeca.commandSync.mockImplementation(() => {
    throw new Error("not a git repository")
})
```

#### 2. `__mocks__/inquirer.ts`
用于 Mock `inquirer` 模块（交互式命令行输入）

**使用方式：**
```typescript
import { vi } from "vitest"
import inquirer from "inquirer"

// 启用 Mock
vi.mock("inquirer")

// 设置 prompt 的返回值
const mockInquirer = inquirer as any

mockInquirer.prompt.mockResolvedValue({
    bump: "patch",
    preRelease: undefined,
    customVersion: undefined,
    yes: true
})
```

## 为什么这些文件目前没有被使用？

1. **当前测试文件主要测试纯函数**：
   - `config.test.ts` - 只测试配置验证，不涉及 execa 或 inquirer
   - `utils.test.ts` - 只测试工具函数，不涉及这些模块

2. **这些 Mock 是为未来测试准备的**：
   - 当需要测试 `release.ts` 时，这些 Mock 就会派上用场
   - 当需要测试 `changelog.ts` 时，也需要这些 Mock

## 完整使用示例

查看 `src/release.test.ts` 文件，可以看到如何使用这些 Mock 的完整示例。

### 测试 release 函数的完整示例：

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest"
import release from "./release"

// 1. 启用 Mock
vi.mock("execa")
vi.mock("inquirer")
vi.mock("fs")

// 2. 导入 Mock 后的模块
import execa from "execa"
import inquirer from "inquirer"
import fs from "fs"

const mockExeca = execa as any
const mockInquirer = inquirer as any
const mockFs = fs as any

describe("release", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        
        // 设置默认的 Mock 返回值
        mockExeca.commandSync.mockReturnValue({
            stdout: "main"
        })
        
        mockFs.access.mockImplementation((path, mode, callback) => {
            callback(null) // 文件存在
        })
        
        mockFs.readFileSync.mockReturnValue(
            JSON.stringify({ version: "1.0.0", name: "test-package" })
        )
    })

    it("应该检查当前分支", async () => {
        mockExeca.commandSync.mockReturnValueOnce({
            stdout: "main"
        })
        
        // 测试代码...
    })
})
```

## 总结

- `__mocks__` 文件夹中的文件**不会自动生效**，需要在测试文件中使用 `vi.mock()` 来启用
- 这些文件是**预留给未来测试使用的**，特别是测试 `release.ts` 和 `changelog.ts` 时
- 使用 Mock 可以避免在测试中实际执行 Git 命令或等待用户输入

