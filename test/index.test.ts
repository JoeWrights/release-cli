import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import run from "../src/index"

// Mock release 模块
vi.mock("../src/release", () => ({
    default: vi.fn(),
}))

import release from "../src/release"

const mockRelease = release as any

describe("index 模块", () => {
    const originalExit = process.exit
    const originalError = console.error

    beforeEach(() => {
        vi.clearAllMocks()
        process.exit = vi.fn() as any
        console.error = vi.fn()
    })

    afterEach(() => {
        process.exit = originalExit
        console.error = originalError
    })

    describe("run 函数", () => {
        it("应该调用 release 函数", () => {
            console.log("📝 测试：run 函数调用 release")
            mockRelease.mockResolvedValue(undefined)

            run({})

            console.log("✅ release 调用次数：", mockRelease.mock.calls.length)
            console.log("📦 调用参数：", mockRelease.mock.calls[0])
            expect(mockRelease).toHaveBeenCalledWith({})
            console.log("✓ run 函数调用测试通过")
        })

        it("应该传递选项给 release 函数", () => {
            mockRelease.mockResolvedValue(undefined)

            const options = { config: "./release.config.js" }
            run(options)

            expect(mockRelease).toHaveBeenCalledWith(options)
        })

        it("应该处理 release 成功的情况", async () => {
            mockRelease.mockResolvedValue(undefined)

            run({})

            // 等待 Promise 完成
            await new Promise((resolve) => setTimeout(resolve, 10))

            expect(process.exit).not.toHaveBeenCalled()
            expect(console.error).not.toHaveBeenCalled()
        })

        it("应该处理 release 失败的情况", async () => {
            const error = new Error("Release failed")
            mockRelease.mockRejectedValue(error)

            run({})

            // 等待 Promise 完成
            await new Promise((resolve) => setTimeout(resolve, 10))

            expect(console.error).toHaveBeenCalledWith(error)
            expect(process.exit).toHaveBeenCalledWith(1)
        })

        it("应该处理不同的错误类型", async () => {
            const error = "String error"
            mockRelease.mockRejectedValue(error)

            run({})

            await new Promise((resolve) => setTimeout(resolve, 10))

            expect(console.error).toHaveBeenCalledWith(error)
            expect(process.exit).toHaveBeenCalledWith(1)
        })
    })
})

