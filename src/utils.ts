/* eslint-disable unicorn/no-process-exit */
import fs from "fs"
import inquirer from "inquirer"
import path from "path"
import semver, { ReleaseType as SemVerReleaseType } from "semver"

import { BUMPS, PRE_RELEASE } from "./constants"
import { PreReleaseType, ReleaseType } from "./types"

/**
 * Get the current working directory
 * @returns The current working directory
 */
export const getCWD = () => {
    return process.cwd()
}

/**
 * Get the path to the CHANGELOG.md file
 * @returns The path to the CHANGELOG.md file
 */
export const getChangeLogPath = () => {
    return path.join(getCWD(), "CHANGELOG.md")
}

/**
 * Get the path to the package.json file
 * @returns The path to the package.json file
 */
export const getPackageJsonPath = () => {
    return path.join(getCWD(), "package.json")
}

/**
 * Get the package.json file
 * @returns The package.json file
 */
export const getPackageJson = () => {
    return require(getPackageJsonPath())
}

/**
 * Get the changelog file stream
 * @returns The changelog file stream
 */
export const getChangelogFileStream = () => {
    return fs.createWriteStream(getChangeLogPath())
}

/**
 * Parse the config json data
 * @param data The config json data
 * @returns The parsed config json data
 */
export const getParsedConfigJsonData = (data: string) => {
    const parsedData = JSON.parse(data)
    const branchBlacklist = parsedData.branchBlacklist || []

    for (const [i, value] of branchBlacklist.entries()) {
        if (typeof value === "string" && value.startsWith("/")) {
            const regexString = parsedData.branchBlacklist[i].slice(1, -1)
            parsedData.branchBlacklist[i] = new RegExp(regexString)
        }
    }

    return parsedData
}

/**
 * Get the bump versions
 * @returns The bump versions
 */
export const getBumpVersions = () => {
    const versions: Record<string, any> = {}
    const curVersion = getPackageJson().version

    BUMPS.forEach((bump) => {
        versions[bump.type] = semver.inc(
            curVersion,
            bump.type as SemVerReleaseType,
        )
    })

    return {
        versions,
        curVersion,
    }
}

/**
 * Get the bump choices
 * @returns The bump choices
 */
export const getBumpChoices = () => {
    const { versions } = getBumpVersions()

    return BUMPS.map((bump) => {
        return {
            name:
                bump.type === ReleaseType.PRERELEASE
                    ? bump.intro
                    : `${bump.intro} (${versions[bump.type]})`,
            value: bump.type,
        }
    })
}

/**
 * Get the prompt questions
 * @returns The prompt questions
 */
export const getPromptQuestions = async () => {
    const bumpChoices = getBumpChoices()
    const curVersion = getPackageJson().version

    let customDefaultVersion = semver.inc(
        curVersion,
        ReleaseType.PATCH as SemVerReleaseType,
    )

    const preReleaseRes = semver.prerelease(curVersion)
    const preReleaseType = preReleaseRes?.find?.(
        (item) =>
            !![
                PreReleaseType.ALPHA,
                PreReleaseType.BETA,
                PreReleaseType.RC,
                PreReleaseType.NEXT,
                PreReleaseType.EXPERIMENTAL,
            ].includes(`${item}` as PreReleaseType),
    )

    if (preReleaseType) {
        customDefaultVersion = semver.inc(
            curVersion,
            ReleaseType.PRERELEASE as SemVerReleaseType,
        )
    }

    const result = await inquirer.prompt([
        {
            type: "list",
            name: "bump",
            message: "请选择版本发布类型:",
            choices: [
                ...bumpChoices,
                {
                    name: "自定义版本",
                    value: ReleaseType.CUSTOM,
                },
            ],
        },
        {
            name: "preRelease",
            type: "list",
            message: "请选择预发布类型:",
            when: (answers) => answers.bump === ReleaseType.PRERELEASE,
            choices: PRE_RELEASE.map((item) => {
                return {
                    name: item.intro,
                    value: item.type,
                }
            }),
        },
        {
            name: "customVersion",
            type: "input",
            message: "请输入自定义版本号:",
            default: customDefaultVersion,
            when: (answers) => answers.bump === ReleaseType.CUSTOM,
            validate: (input) => {
                if (input && !semver.valid(input)) {
                    return "输入的版本号不规范，请重新输入"
                }
                return true
            },
        },
    ])

    return result
}

/**
 * Show the error
 * @param error The error
 * @param insertMessage The insert message
 */
export const showError = (error: Error, insertMessage?: () => void) => {
    if (error && error.message) {
        console.error("\u001B[31m")
        console.trace(error)
        insertMessage?.()
        console.error("\u001B[0m")
    }

    process.exit(1)
}

/**
 * Check if the file exists
 * @param filePath The file path
 * @returns The file exists
 */
export const asyncFileIsExists = (filePath: string) => {
    return new Promise((resolve) => {
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                resolve(false)
            } else {
                resolve(true)
            }
        })
    })
}
