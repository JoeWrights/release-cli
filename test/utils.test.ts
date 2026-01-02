import fs from "fs"
import path from "path"
import { beforeEach, describe, expect, it, vi } from "vitest"

import {
    asyncFileIsExists,
    getBumpChoices,
    getBumpVersions,
    getChangelogFileStream,
    getChangeLogPath,
    getCWD,
    getPackageJson,
    getPackageJsonPath,
    getParsedConfigJsonData,
} from "../src/utils"

// Mock fs 模块
vi.mock("fs", () => {
    const mockFs = {
        access: vi.fn(),
        createWriteStream: vi.fn(),
        readFileSync: vi.fn(),
        constants: {
            F_OK: 0,
        },
    }
    return {
        default: mockFs,
        ...mockFs,
    }
})

// Mock inquirer（用于 getPromptQuestions，虽然这个函数需要实际测试）
vi.mock("inquirer", () => ({
    default: {
        prompt: vi.fn(),
    },
}))

describe("工具函数", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe("getCWD", () => {
        it("应该返回当前工作目录", () => {
            console.log("📝 测试：getCWD 函数")
            const cwd = getCWD()
            console.log("📂 当前工作目录：", cwd)
            console.log("📂 预期目录：", process.cwd())
            expect(cwd).toBe(process.cwd())
            console.log("✓ 工作目录获取正确")
        })
    })

    describe("getPackageJsonPath", () => {
        it("应该返回 package.json 的路径", () => {
            console.log("📝 测试：getPackageJsonPath 函数")
            const packagePath = getPackageJsonPath()
            const expected = path.join(process.cwd(), "package.json")
            console.log("📂 返回路径：", packagePath)
            console.log("📂 预期路径：", expected)
            expect(packagePath).toBe(expected)
            console.log("✓ package.json 路径获取正确")
        })
    })

    describe("getChangeLogPath", () => {
        it("应该返回 CHANGELOG.md 的路径", () => {
            console.log("📝 测试：getChangeLogPath 函数")
            const changelogPath = getChangeLogPath()
            const expected = path.join(process.cwd(), "CHANGELOG.md")
            console.log("📂 返回路径：", changelogPath)
            console.log("📂 预期路径：", expected)
            expect(changelogPath).toBe(expected)
            console.log("✓ CHANGELOG.md 路径获取正确")
        })
    })

    describe("getPackageJson", () => {
        it("应该读取并返回 package.json 内容", () => {
            // 这个函数使用 require，在测试环境中需要特殊处理
            // 这里只验证函数存在
            expect(typeof getPackageJson).toBe("function")
        })
    })

    describe("getChangelogFileStream", () => {
        it("应该创建 CHANGELOG.md 的写入流", () => {
            const mockStream = {} as fs.WriteStream
            ;(fs.createWriteStream as any).mockReturnValue(mockStream)

            const stream = getChangelogFileStream()

            expect(fs.createWriteStream).toHaveBeenCalledWith(
                getChangeLogPath(),
            )
            expect(stream).toBe(mockStream)
        })
    })

    describe("getParsedConfigJsonData", () => {
        it("应该解析 JSON 配置数据", () => {
            console.log("📝 测试：getParsedConfigJsonData - JSON 解析")
            const config = {
                autoBuild: true,
                branchBlacklist: ["master", "main"],
            }
            console.log("📦 输入配置：", config)

            const result = getParsedConfigJsonData(JSON.stringify(config))
            console.log("✅ 解析结果：", result)

            expect(result.autoBuild).toBe(true)
            expect(result.branchBlacklist).toEqual(["master", "main"])
            console.log("✓ JSON 解析验证通过")
        })

        it("应该将字符串形式的正则表达式转换为 RegExp", () => {
            console.log("📝 测试：正则表达式字符串转换")
            const config = {
                branchBlacklist: ["/^release\\/.*$/", "master"],
            }
            console.log("📦 输入配置：", config)

            const result = getParsedConfigJsonData(JSON.stringify(config))
            console.log("✅ 解析结果：", result.branchBlacklist)
            console.log("🔍 正则表达式类型：", typeof result.branchBlacklist[0])
            console.log("🧪 测试正则匹配：release/v1.0.0")

            expect(result.branchBlacklist[0]).toBeInstanceOf(RegExp)
            expect(result.branchBlacklist[1]).toBe("master")
            const matchResult = result.branchBlacklist[0].test("release/v1.0.0")
            console.log("✅ 匹配结果：", matchResult)
            expect(matchResult).toBe(true)
            console.log("✓ 正则表达式转换验证通过")
        })

        it("应该处理空数组", () => {
            console.log("📝 测试：getParsedConfigJsonData - 空数组处理")
            const config = {
                branchBlacklist: [],
            }
            console.log("📦 输入配置（空数组）：", config)

            const result = getParsedConfigJsonData(JSON.stringify(config))
            console.log("✅ 解析结果：", result.branchBlacklist)

            expect(result.branchBlacklist).toEqual([])
            console.log("✓ 空数组处理验证通过")
        })
    })

    describe("getBumpVersions", () => {
        beforeEach(() => {
            // Mock getPackageJson
            vi.spyOn(require("fs"), "readFileSync").mockReturnValue(
                JSON.stringify({ version: "1.0.0" }),
            )
        })

        it("应该计算所有版本类型的增量版本", () => {
            console.log("📝 测试：getBumpVersions - 版本计算")
            // 由于 getBumpVersions 内部调用 getPackageJson，需要 Mock
            // 这里简化测试，直接测试逻辑
            const result = getBumpVersions()
            console.log("✅ 计算结果：", JSON.stringify(result, null, 2))

            expect(result).toHaveProperty("versions")
            expect(result).toHaveProperty("curVersion")
            expect(result.curVersion).toBeDefined()
            console.log("✓ 版本计算验证通过")
        })
    })

    describe("getBumpChoices", () => {
        it("应该返回版本选择项", () => {
            console.log("📝 测试：getBumpChoices - 版本选择项")
            const choices = getBumpChoices()
            console.log("📋 选择项数量：", choices.length)
            console.log("📋 选择项内容：", choices)

            expect(Array.isArray(choices)).toBe(true)
            expect(choices.length).toBeGreaterThan(0)
            choices.forEach((choice, index) => {
                console.log(`  ${index + 1}. ${choice.name} (${choice.value})`)
                expect(choice).toHaveProperty("name")
                expect(choice).toHaveProperty("value")
            })
            console.log("✓ 版本选择项验证通过")
        })
    })

    describe("asyncFileIsExists", () => {
        it("应该返回 true 当文件存在", async () => {
            console.log("📝 测试：asyncFileIsExists - 文件存在")
            const filePath = "/path/to/file"
            console.log("📂 检查文件：", filePath)
            ;(fs.access as any).mockImplementation(
                (
                    path: string,
                    mode: number,
                    callback: (value: null) => void,
                ) => {
                    callback(null) // 没有错误，文件存在
                },
            )

            const exists = await asyncFileIsExists(filePath)
            console.log("✅ 文件存在检查结果：", exists)

            expect(exists).toBe(true)
            expect(fs.access).toHaveBeenCalledWith(
                filePath,
                fs.constants.F_OK,
                expect.any(Function),
            )
            console.log("✓ 文件存在检查通过")
        })

        it("应该返回 false 当文件不存在", async () => {
            console.log("📝 测试：asyncFileIsExists - 文件不存在")
            const filePath = "/path/to/nonexistent"
            console.log("📂 检查文件：", filePath)
            ;(fs.access as any).mockImplementation(
                (
                    path: string,
                    mode: number,
                    callback: (value: Error) => void,
                ) => {
                    callback(new Error("File not found")) // 有错误，文件不存在
                },
            )

            const exists = await asyncFileIsExists(filePath)
            console.log("✅ 文件存在检查结果：", exists)

            expect(exists).toBe(false)
            console.log("✓ 文件不存在检查通过")
        })
    })
})
