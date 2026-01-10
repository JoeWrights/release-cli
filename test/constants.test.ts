import { describe, expect, it } from "vitest"

import { BUMPS, PRE_RELEASE } from "../src/constants"
import { PreReleaseType, ReleaseType } from "../src/types"

describe("constants 模块", () => {
    describe("BUMPS", () => {
        it("应该包含所有版本类型", () => {
            console.log("📝 测试：BUMPS 常量")
            console.log("📦 BUMPS 数量：", BUMPS.length)
            console.log(
                "📋 BUMPS 内容：",
                BUMPS.map((b) => ({ type: b.type, intro: b.intro })),
            )

            expect(BUMPS).toHaveLength(4)
            const types = BUMPS.map((b) => b.type)
            console.log("✅ 版本类型：", types)
            expect(types).toEqual([
                ReleaseType.MAJOR,
                ReleaseType.MINOR,
                ReleaseType.PATCH,
                ReleaseType.PRERELEASE,
            ])
            console.log("✓ BUMPS 常量验证通过")
        })

        it("每个 bump 应该有 type 和 intro 属性", () => {
            BUMPS.forEach((bump) => {
                expect(bump).toHaveProperty("type")
                expect(bump).toHaveProperty("intro")
                expect(typeof bump.type).toBe("string")
                expect(typeof bump.intro).toBe("string")
            })
        })

        it("应该包含正确的版本类型描述", () => {
            const majorBump = BUMPS.find((b) => b.type === ReleaseType.MAJOR)
            expect(majorBump?.intro).toContain("大版本")

            const minorBump = BUMPS.find((b) => b.type === ReleaseType.MINOR)
            expect(minorBump?.intro).toContain("小版本")

            const patchBump = BUMPS.find((b) => b.type === ReleaseType.PATCH)
            expect(patchBump?.intro).toContain("补丁版本")

            const preReleaseBump = BUMPS.find(
                (b) => b.type === ReleaseType.PRERELEASE,
            )
            expect(preReleaseBump).toBeDefined()
            expect(preReleaseBump?.intro).toContain("预发布")
        })
    })

    describe("PRE_RELEASE", () => {
        it("应该包含所有预发布类型", () => {
            expect(PRE_RELEASE).toHaveLength(5)
            expect(PRE_RELEASE.map((p) => p.type)).toEqual([
                PreReleaseType.ALPHA,
                PreReleaseType.BETA,
                PreReleaseType.RC,
                PreReleaseType.NEXT,
                PreReleaseType.EXPERIMENTAL,
            ])
        })

        it("每个预发布类型应该有 type 和 intro 属性", () => {
            PRE_RELEASE.forEach((preRelease) => {
                expect(preRelease).toHaveProperty("type")
                expect(preRelease).toHaveProperty("intro")
                expect(typeof preRelease.type).toBe("string")
                expect(typeof preRelease.intro).toBe("string")
            })
        })

        it("应该包含正确的预发布类型描述", () => {
            const alpha = PRE_RELEASE.find(
                (p) => p.type === PreReleaseType.ALPHA,
            )
            expect(alpha?.intro).toContain("alpha")

            const beta = PRE_RELEASE.find((p) => p.type === PreReleaseType.BETA)
            expect(beta?.intro).toContain("beta")

            const rc = PRE_RELEASE.find((p) => p.type === PreReleaseType.RC)
            expect(rc?.intro).toContain("rc")

            const next = PRE_RELEASE.find((p) => p.type === PreReleaseType.NEXT)
            expect(next?.intro).toContain("next")

            const experimental = PRE_RELEASE.find(
                (p) => p.type === PreReleaseType.EXPERIMENTAL,
            )
            expect(experimental?.intro).toContain("experimental")
        })
    })
})
