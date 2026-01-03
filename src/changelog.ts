/* eslint-disable no-param-reassign */
import cc from "conventional-changelog"
import execa from "execa"

import { COMMIT_TYPES_DISPLAY_NAME } from "./constants"
import { CommitType, ReleaseCliOptions } from "./types"
import { getChangelogFileStream } from "./utils"

// 动态导入 angular preset
const angularPreset = require("conventional-changelog-angular")

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
        const formattedVersion = `${options?.tagPrefix ||
            "v"}${version}${options?.tagSuffix || ""}`
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

    // commit type 展示名称
    const typeDisplayName: Record<CommitType, string> = {
        ...COMMIT_TYPES_DISPLAY_NAME,
        ...(options.commitTypeDisplayName || {}),
    }

    // 定义排序顺序（按优先级排序）
    const typeOrder = [
        typeDisplayName[CommitType.FEAT],
        typeDisplayName[CommitType.FIX],
        typeDisplayName[CommitType.PERF],
        typeDisplayName[CommitType.REFACTOR],
        typeDisplayName[CommitType.STYLE],
        typeDisplayName[CommitType.CHORE],
        typeDisplayName[CommitType.TYPES],
        typeDisplayName[CommitType.I18N],
        typeDisplayName[CommitType.DEPS],
        typeDisplayName[CommitType.TEST],
        typeDisplayName[CommitType.BUILD],
        typeDisplayName[CommitType.CI],
        typeDisplayName[CommitType.REVERT],
        typeDisplayName[CommitType.DOCS],
        typeDisplayName[CommitType.SECURITY],
        typeDisplayName[CommitType.ACCESSIBILITY],
    ].filter(Boolean)

    // 创建类型名称到排序权重的映射（用于快速查找排序顺序）
    const typeSortMap = new Map<string, number>()
    typeOrder.forEach((type, index) => {
        if (type) {
            typeSortMap.set(type, index)
        }
    })

    // 加载 angular preset 配置（angularPreset 本身就是一个 Promise）
    const angularConfig = await angularPreset

    cc({
        releaseCount: 0,
        pkg: {
            transform: (pkg: Record<string, any>) => {
                pkg.version = `v${version}`
                return pkg
            },
        },
        config: {
            parserOpts: angularConfig.parserOpts,
            writerOpts: {
                ...angularConfig.writerOpts,
                transform: (commit: any, context: any) => {
                    // 首先处理 BREAKING CHANGES
                    if (commit.notes && commit.notes.length > 0) {
                        commit.notes.forEach((note: any) => {
                            note.title = "BREAKING CHANGES"
                        })
                    }

                    // 处理 revert 类型（需要在类型转换之前处理）
                    if (commit.revert) {
                        commit.type = typeDisplayName.revert || "Reverts"
                    }

                    // 将提交类型转换为对应的显示名称
                    // 重要：先转换类型，确保所有类型都被识别和保留
                    if (
                        commit.type &&
                        typeDisplayName[
                            commit.type as keyof typeof COMMIT_TYPES_DISPLAY_NAME
                        ]
                    ) {
                        commit.type =
                            typeDisplayName[
                                commit.type as keyof typeof COMMIT_TYPES_DISPLAY_NAME
                            ]
                    } else if (commit.type) {
                        // 如果类型不在映射中，首字母大写
                        commit.type =
                            commit.type.charAt(0).toUpperCase() +
                            commit.type.slice(1)
                    }

                    // 为 commit 添加排序权重（存储在属性中，用于排序）
                    if (commit.type) {
                        const sortOrder = typeSortMap.get(commit.type)
                        // 使用一个属性来存储排序权重
                        commit.sortOrder =
                            sortOrder !== undefined ? sortOrder : 9999
                    }

                    // 如果没有类型，跳过这个提交（可能是 merge commit 等）
                    if (!commit.type) {
                        return
                    }

                    // 处理 scope
                    if (commit.scope === "*") {
                        commit.scope = ""
                    }

                    // 处理 shortHash
                    if (typeof commit.hash === "string") {
                        commit.shortHash = commit.hash.slice(0, 7)
                    }

                    // 处理 subject 中的 issue 链接和用户提及
                    if (typeof commit.subject === "string") {
                        const issues: string[] = []
                        let url = context.repository
                            ? `${context.host}/${context.owner}/${context.repository}`
                            : context.repoUrl

                        if (url) {
                            url = `${url}/issues/`
                            // Issue URLs
                            commit.subject = commit.subject.replace(
                                /#(\d+)/g,
                                (_: string, issue: string) => {
                                    issues.push(issue)
                                    return `[#${issue}](${url}${issue})`
                                },
                            )
                        }

                        if (context.host) {
                            // User URLs
                            commit.subject = commit.subject.replace(
                                /\B@([\da-z](?:-?[\da-z]){0,38})/g,
                                (_: string, username: string) => {
                                    if (username.includes(".")) {
                                        return `@${username}`
                                    }
                                    return `[@${username}](${context.host}/${username})`
                                },
                            )
                        }

                        // 移除已经处理的 references
                        if (commit.references) {
                            commit.references = commit.references.filter(
                                (ref: any) => {
                                    return !issues.includes(ref.issue)
                                },
                            )
                        }
                    }

                    // 返回 commit（保留所有类型，不进行过滤）
                    return commit
                },
                groupBy: "type",
                // 使用排序权重进行排序，性能更好
                commitGroupsSort: (a: any, b: any) => {
                    // 从第一个 commit 中获取排序权重（所有相同类型的 commit 权重相同）
                    const aSort =
                        a.commits && a.commits[0]
                            ? a.commits[0].sortOrder ?? 9999
                            : 9999
                    const bSort =
                        b.commits && b.commits[0]
                            ? b.commits[0].sortOrder ?? 9999
                            : 9999
                    return aSort - bSort
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
