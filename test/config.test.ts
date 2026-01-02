import { describe, it, expect } from "vitest"
import { validateConfig, safeValidateConfig } from "../src/config"

describe("配置验证", () => {
    describe("validateConfig", () => {
        it("应该接受有效的配置", () => {
            console.log("📝 测试：验证有效配置")
            const config = {
                autoBuild: true,
                autoTag: false,
                tagSuffix: "-stable",
                branchBlacklist: ["master", "main"],
                packageJsonFileIndent: 2,
            }
            console.log("📦 输入配置：", JSON.stringify(config, null, 2))

            const result = validateConfig(config)
            console.log("✅ 验证结果：", JSON.stringify(result, null, 2))

            expect(result.autoBuild).toBe(true)
            expect(result.autoTag).toBe(false)
            expect(result.tagSuffix).toBe("-stable")
            expect(result.branchBlacklist).toEqual(["master", "main"])
            expect(result.packageJsonFileIndent).toBe(2)
            console.log("✓ 所有断言通过")
        })

        it("应该应用默认值", () => {
            console.log("📝 测试：验证默认值应用")
            const config = {}
            console.log("📦 输入配置（空对象）：", config)

            const result = validateConfig(config)
            console.log("✅ 应用默认值后的结果：", JSON.stringify(result, null, 2))

            expect(result.autoBuild).toBe(true)
            expect(result.autoTag).toBe(false)
            expect(result.tagSuffix).toBe("")
            expect(result.branchBlacklist).toEqual(["master", "main"])
            expect(result.packageJsonFileIndent).toBe(4)
            console.log("✓ 默认值验证通过")
        })

        it("应该验证布尔值类型", () => {
            console.log("📝 测试：验证布尔值类型检查")
            const config = {
                autoBuild: "true", // 字符串，应该失败
            }
            console.log("📦 输入配置（无效类型）：", config)
            console.log("⚠️  预期：应该抛出错误")

            try {
                validateConfig(config)
                console.log("❌ 未抛出错误，测试失败")
            } catch (error) {
                console.log("✅ 正确抛出错误：", (error as Error).message)
            }

            expect(() => validateConfig(config)).toThrow()
            console.log("✓ 类型验证通过")
        })

        it("应该验证数组类型", () => {
            console.log("📝 测试：验证数组类型检查")
            const config = {
                branchBlacklist: "not-an-array", // 字符串，应该失败
            }
            console.log("📦 输入配置（无效类型）：", config)
            console.log("⚠️  预期：应该抛出错误")

            expect(() => validateConfig(config)).toThrow()
            console.log("✓ 数组类型验证通过")
        })

        it("应该验证数组元素类型", () => {
            console.log("📝 测试：验证数组元素类型检查")
            const config = {
                branchBlacklist: [123, 456], // 数字数组，应该失败
            }
            console.log("📦 输入配置（无效元素类型）：", config)
            console.log("⚠️  预期：应该抛出错误")

            expect(() => validateConfig(config)).toThrow()
            console.log("✓ 数组元素类型验证通过")
        })

        it("应该验证数字类型", () => {
            console.log("📝 测试：验证数字类型检查")
            const config = {
                packageJsonFileIndent: "4", // 字符串，应该失败
            }
            console.log("📦 输入配置（无效类型）：", config)
            console.log("⚠️  预期：应该抛出错误")

            expect(() => validateConfig(config)).toThrow()
            console.log("✓ 数字类型验证通过")
        })

        it("应该接受数字类型", () => {
            console.log("📝 测试：验证数字类型接受")
            const config = {
                packageJsonFileIndent: 2, // 正数
            }
            console.log("📦 输入配置：", config)

            const result = validateConfig(config)
            console.log("✅ 验证结果：", result.packageJsonFileIndent)
            expect(result.packageJsonFileIndent).toBe(2)
            console.log("✓ 数字类型接受验证通过")
        })

        it("应该接受零和负数（superstruct 不验证范围）", () => {
            console.log("📝 测试：验证数字范围（注意：superstruct 不验证范围）")
            // 注意：superstruct 的 number() 只验证类型，不验证范围
            // 如果需要验证范围，需要使用 refinement
            const config = {
                packageJsonFileIndent: 0,
            }
            console.log("📦 输入配置：", config)

            const result = validateConfig(config)
            console.log("✅ 验证结果：", result.packageJsonFileIndent)
            expect(result.packageJsonFileIndent).toBe(0)
            console.log("✓ 数字范围验证通过")
        })

        it("应该拒绝非对象配置", () => {
            console.log("📝 测试：验证非对象配置拒绝")
            const invalidInputs = ["not-an-object", null, 123]
            console.log("📦 无效输入：", invalidInputs)

            invalidInputs.forEach((input) => {
                console.log(`⚠️  测试输入：${typeof input} =`, input)
                expect(() => validateConfig(input)).toThrow()
            })
            console.log("✓ 非对象配置拒绝验证通过")
        })
    })

    describe("safeValidateConfig", () => {
        it("应该返回成功结果对于有效配置", () => {
            console.log("📝 测试：safeValidateConfig - 有效配置")
            const config = {
                autoBuild: true,
                autoTag: false,
            }
            console.log("📦 输入配置：", config)

            const result = safeValidateConfig(config)
            console.log("✅ 验证结果：", JSON.stringify(result, null, 2))

            expect(result.success).toBe(true)
            expect(result.data).toBeDefined()
            expect(result.data?.autoBuild).toBe(true)
            expect(result.data?.autoTag).toBe(false)
            console.log("✓ 安全验证通过")
        })

        it("应该返回错误结果对于无效配置", () => {
            console.log("📝 测试：safeValidateConfig - 无效配置")
            const config = {
                autoBuild: "invalid",
            }
            console.log("📦 输入配置（无效）：", config)

            const result = safeValidateConfig(config)
            console.log("✅ 验证结果：", result)
            if (result.error) {
                console.log("⚠️  错误信息：", result.error)
            }

            expect(result.success).toBe(false)
            expect(result.error).toBeDefined()
            expect(result.error).toContain("配置验证失败")
            console.log("✓ 错误处理验证通过")
        })
    })
})

