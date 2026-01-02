import cc from "conventional-changelog"
import execa from "execa"
import fs from "fs"

import { ReleaseCliOptions } from "./types"
import { getChangeLogPath } from "./utils"

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
    const changelogPath = getChangeLogPath()
    const formattedVersion = `v${version}`

    // 读取现有的 changelog 内容（如果存在）
    let existingContent = ""
    try {
        if (fs.existsSync(changelogPath)) {
            existingContent = fs.readFileSync(changelogPath, "utf-8")
        }
    } catch (error) {
        // 如果读取失败，继续使用空内容
    }

    // 收集新生成的 changelog 内容
    let newChangelogContent = ""
    const chunks: string[] = []

    return new Promise<void>((resolve, reject) => {
        cc({
            preset: "angular",
            releaseCount: 0, // 只生成当前版本的 changelog
            context: {
                version: formattedVersion, // 设置版本号格式为 v{version}
            },
            pkg: {
                transform: (pkg: Record<string, any>) => {
                    return {
                        ...pkg,
                        version: formattedVersion,
                    }
                },
            },
        } as Parameters<typeof cc>[0])
            .on("data", (chunk: Buffer) => {
                chunks.push(chunk.toString("utf-8"))
            })
            .on("end", async () => {
                try {
                    // 合并新生成的 changelog 和现有内容
                    newChangelogContent = chunks.join("")

                    // 如果现有内容存在且不为空，将新内容添加到顶部
                    // 如果新内容为空，说明没有新的提交，只保留现有内容
                    const finalContent = newChangelogContent.trim()
                        ? newChangelogContent +
                          (existingContent ? `\n\n${existingContent}` : "")
                        : existingContent

                    // 写入合并后的内容
                    fs.writeFileSync(changelogPath, finalContent, "utf-8")

                    await executeGitCommand(version, options)
                    resolve()
                } catch (error) {
                    reject(error)
                }
            })
            .on("error", (error: Error) => {
                reject(error)
            })
    })
}

export default generateChangelog
