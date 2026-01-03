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

    // 扩展支持的提交类型映射
    const types: Record<string, string> = {
        feat: "Features",
        fix: "Bug Fixes",
        perf: "Performance Improvements",
        revert: "Reverts",
        docs: "Documentation",
        style: "Styles",
        chore: "Chores",
        refactor: "Code Refactoring",
        test: "Tests",
        build: "Build System",
        ci: "Continuous Integration",
    }

    // 定义排序顺序
    const typeOrder = [
        "Features",
        "Bug Fixes",
        "Performance Improvements",
        "Code Refactoring",
        "Documentation",
        "Styles",
        "Tests",
        "Build System",
        "Continuous Integration",
        "Chores",
        "Reverts",
    ]

    // 使用顶层的 transform 来修改提交类型
    // 这样不会覆盖 preset 的 writerOpts.transform
    cc({
        preset: "angular",
        releaseCount: 0,
        pkg: {
            transform: (pkg) => {
                pkg.version = `v${version}`
                return pkg
            },
        },
        transform: (commit) => {
            // 将提交类型转换为对应的显示名称
            // 这个 transform 在 preset 的 writerOpts.transform 之前执行
            if (commit.type && types[commit.type]) {
                commit.type = types[commit.type]
            } else if (commit.type) {
                // 如果类型不在映射中，首字母大写
                commit.type =
                    commit.type.charAt(0).toUpperCase() + commit.type.slice(1)
            }
            return commit
        },
        config: {
            writerOpts: {
                // 只覆盖排序相关的选项，不覆盖 transform
                // transform 会使用 preset 的默认值
                groupBy: "type",
                commitGroupsSort: (a: any, b: any) => {
                    const aIndex = typeOrder.indexOf(`${a.title}`)
                    const bIndex = typeOrder.indexOf(`${b.title}`)
                    if (aIndex === -1 && bIndex === -1) {
                        return `${a.title}`.localeCompare(`${b.title}`)
                    }
                    if (aIndex === -1) {
                        return 1
                    }
                    if (bIndex === -1) {
                        return -1
                    }
                    return aIndex - bIndex
                },
                commitsSort: ["scope", "subject"],
            },
        },
    })
        .pipe(fileStream)
        .on("close", async () => {
            await executeGitCommand(version, options)
        })
}

export default generateChangelog
