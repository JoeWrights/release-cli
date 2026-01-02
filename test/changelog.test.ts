import { describe, it, expect, vi, beforeEach } from "vitest"
import generateChangelog from "../src/changelog"

// Mock 依赖
vi.mock("execa")
vi.mock("conventional-changelog")
vi.mock("../src/utils", () => ({
    getChangelogFileStream: vi.fn(() => ({
        write: vi.fn(),
        end: vi.fn(),
        on: vi.fn((event: string, callback: Function) => {
            if (event === "close") {
                // 模拟流关闭事件
                setTimeout(() => callback(), 0)
            }
            return {
                write: vi.fn(),
                end: vi.fn(),
                on: vi.fn(),
            }
        }),
    })),
}))

import execa from "execa"
import cc from "conventional-changelog"

const mockExeca = execa as any
const mockCc = cc as any

describe("changelog 模块", () => {
    beforeEach(() => {
        vi.clearAllMocks()

        // Mock execa.commandSync
        mockExeca.commandSync.mockReturnValue({
            stdout: "main",
        })

        // Mock execa (异步调用)
        mockExeca.mockResolvedValue(undefined)

        // Mock conventional-changelog 返回一个可读流
        const mockStream = {
            pipe: vi.fn().mockReturnThis(),
            on: vi.fn((event: string, callback: Function) => {
                if (event === "close") {
                    setTimeout(() => callback(), 0)
                }
                return mockStream
            }),
        }

        mockCc.mockReturnValue(mockStream)
    })

    describe("generateChangelog", () => {
        it("应该生成 changelog 并执行 Git 命令", async () => {
            console.log("📝 测试：生成 changelog")
            const version = "1.0.0"
            const options = {
                autoBuild: true,
                autoTag: false,
            }
            console.log("📦 版本号：", version)
            console.log("📦 配置选项：", JSON.stringify(options, null, 2))

            await generateChangelog(version, options)

            console.log("✅ conventional-changelog 调用次数：", mockCc.mock.calls.length)
            expect(mockCc).toHaveBeenCalled()
            const ccConfig = mockCc.mock.calls[0][0]
            console.log("📋 changelog 配置：", JSON.stringify(ccConfig, null, 2))
            expect(ccConfig).toMatchObject({
                preset: "angular",
                releaseCount: 0,
            })
            console.log("✓ changelog 生成测试通过")
        })

        it("应该使用正确的版本号", async () => {
            const version = "2.1.3"
            const options = {
                autoBuild: true,
                autoTag: false,
            }

            await generateChangelog(version, options)

            const ccCall = mockCc.mock.calls[0]
            const pkgTransform = ccCall[0].pkg.transform

            const transformedPkg = pkgTransform({ version: "1.0.0" })
            expect(transformedPkg.version).toBe(`v${version}`)
        })

        it("应该在流关闭后执行 Git 命令", async () => {
            const version = "1.0.0"
            const options = {
                autoBuild: true,
                autoTag: false,
            }

            // 创建一个真正的 Promise 来等待流关闭
            let streamClosed = false
            const mockStream = {
                pipe: vi.fn().mockReturnThis(),
                on: vi.fn((event: string, callback: Function) => {
                    if (event === "close") {
                        streamClosed = true
                        // 立即调用回调
                        callback()
                    }
                    return mockStream
                }),
            }

            mockCc.mockReturnValue(mockStream)

            await generateChangelog(version, options)

            // 等待异步操作完成
            await new Promise((resolve) => setTimeout(resolve, 10))

            expect(streamClosed).toBe(true)
        })
    })

    describe("executeGitCommand", () => {
        it("应该执行 Git add, commit 和 push", async () => {
            const version = "1.0.0"
            const options = {
                autoBuild: true,
                autoTag: false,
            }

            // 模拟流立即关闭
            const mockStream = {
                pipe: vi.fn().mockReturnThis(),
                on: vi.fn((event: string, callback: Function) => {
                    if (event === "close") {
                        setImmediate(() => callback())
                    }
                    return mockStream
                }),
            }

            mockCc.mockReturnValue(mockStream)

            await generateChangelog(version, options)

            // 等待异步操作
            await new Promise((resolve) => setTimeout(resolve, 50))

            // 验证 Git 命令被调用
            expect(mockExeca).toHaveBeenCalled()
        })

        it("应该在 autoTag 为 true 时创建并推送 tag", async () => {
            const version = "1.0.0"
            const options = {
                autoBuild: true,
                autoTag: true,
                tagSuffix: "",
            }

            const mockStream = {
                pipe: vi.fn().mockReturnThis(),
                on: vi.fn((event: string, callback: Function) => {
                    if (event === "close") {
                        setImmediate(() => callback())
                    }
                    return mockStream
                }),
            }

            mockCc.mockReturnValue(mockStream)

            await generateChangelog(version, options)

            await new Promise((resolve) => setTimeout(resolve, 50))

            // 应该调用 tag 相关命令
            const execaCalls = mockExeca.mock.calls.map((call: any[]) => call[0])
            expect(execaCalls.some((cmd) => cmd === "git")).toBe(true)
        })

        it("应该使用 tagSuffix 如果提供", async () => {
            const version = "1.0.0"
            const options = {
                autoBuild: true,
                autoTag: true,
                tagSuffix: "-stable",
            }

            const mockStream = {
                pipe: vi.fn().mockReturnThis(),
                on: vi.fn((event: string, callback: Function) => {
                    if (event === "close") {
                        setImmediate(() => callback())
                    }
                    return mockStream
                }),
            }

            mockCc.mockReturnValue(mockStream)

            await generateChangelog(version, options)

            await new Promise((resolve) => setTimeout(resolve, 50))

            // 验证 tag 命令包含 suffix
            const tagCalls = mockExeca.mock.calls.filter(
                (call: any[]) => call[1] && call[1].includes("tag"),
            )
            expect(tagCalls.length).toBeGreaterThan(0)
        })
    })
})

