/* eslint-disable no-param-reassign */
import cc from "conventional-changelog"
import execa from "execa"

import { ReleaseCliOptions } from "./types"
import { getChangelogFileStream } from "./utils"

/**
 * Execute the git command
 * @param version The version
 * @param options The options
 * @returns void
 */
async function executeGitCommand(version: string, options: ReleaseCliOptions) {
    await execa("git", ["add", "-A"], { stdio: "inherit" })
    await execa(
        "git",
        ["commit", "-m", `chore: v${version} changelog [ci skip]`],
        { stdio: "inherit" },
    )

    const { stdout: curBranch } = execa.commandSync(
        "git symbolic-ref --short HEAD",
    )

    await execa("git", ["push", "origin", curBranch], { stdio: "inherit" })

    if (options?.autoTag) {
        const formattedVersion = `v${version}${options?.tagSuffix || ""}`
        await execa(
            "git",
            [
                "tag",
                "-a",
                formattedVersion,
                "-m",
                `chore: v${version} changelog [ci skip]`,
            ],
            { stdio: "inherit" },
        )
        await execa("git", ["push", "origin", formattedVersion], {
            stdio: "inherit",
        })
    }
}

/**
 * Generate the changelog
 * @param version The version
 * @param options The options
 * @returns void
 */
async function generateChangelog(version: string, options: ReleaseCliOptions) {
    const fileStream = getChangelogFileStream()

    // releaseCount 控制生成多少个版本的 changelog
    // - 0: 生成所有版本（多个版本号）- 注意：实际生成的版本数取决于 Git 标签数量
    // - 1: 只生成最新一个版本（单个版本号，默认值）
    // - 2+: 生成最近 N 个版本
    //
    // 重要说明：
    // - 如果项目只有 1 个 Git 标签，即使 releaseCount: 0，也只会生成 1 个版本
    // - 如果项目有多个 Git 标签，releaseCount: 0 会生成所有版本
    // - reset: true 确保覆盖现有 CHANGELOG.md，而不是追加
    const releaseCount = options?.releaseCount || 0

    cc({
        preset: "angular",
        releaseCount,
        pkg: {
            transform: (pkg: Record<string, any>) => {
                pkg.version = `v${version}`
                return pkg
            },
        },
    })
        .pipe(fileStream)
        .on("close", async () => {
            await executeGitCommand(version, options)
        })
}

export default generateChangelog
