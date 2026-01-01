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

    cc({
        preset: "angular",
        releaseCount: 0,
        pkg: {
            transform: (pkg: Record<string, any>) => {
                return {
                    ...pkg,
                    version: `v${version}`,
                }
            },
        },
    } as Parameters<typeof cc>[0])
        .pipe(fileStream)
        .on("close", async () => {
            await executeGitCommand(version, options)
        })
}

export default generateChangelog
