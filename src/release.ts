import execa from "execa"
import fs from "fs"
import inquirer from "inquirer"
import { yellow } from "kolorist"
import path from "path"
import semver, { ReleaseType as SemVerReleaseType } from "semver"

import generateChangelog from "./changelog"
import { validateConfig } from "./config"
import { ReleaseCliOptions, ReleaseType } from "./types"
import {
    asyncFileIsExists,
    getBumpVersions,
    getCWD,
    getPackageJson,
    getPackageJsonPath,
    getParsedConfigJsonData,
    getPromptQuestions,
    showError,
} from "./utils"

/**
 * Release the project
 * @param options The options
 * @returns void
 */
async function release(options?: Record<string, any>) {
    if (options?.version) {
        return console.log(yellow(require("../package.json").version))
    }

    const exists = await asyncFileIsExists(getPackageJsonPath())

    if (!exists) {
        return showError(new Error("package.json 文件不存在"))
    }

    let curBranch: string

    try {
        const { stdout: b } = execa.commandSync("git symbolic-ref --short HEAD")
        curBranch = b
    } catch {
        return showError(new Error("当前不在git仓库中，请先初始化git仓库"))
    }

    const { stdout: statusStdout } = execa.commandSync("git status -s")

    let rawConfig: Record<string, any> = {
        autoBuild: true,
        autoTag: false,
        branchBlacklist: ["master", "main"],
        packageJsonFileIndent: 4,
    }

    if (options?.config) {
        const config = require(path.resolve(getCWD(), options.config))

        rawConfig =
            typeof config === "function"
                ? {
                      ...rawConfig,
                      ...config(),
                  }
                : {
                      ...rawConfig,
                      ...config,
                  }
    } else {
        const releaseCliConfig = getPackageJson().releaseCliConfig

        if (releaseCliConfig) {
            rawConfig = {
                ...rawConfig,
                ...releaseCliConfig,
            }
        }
    }

    // 使用 superstruct 验证配置
    let mergedConfig: ReleaseCliOptions
    try {
        mergedConfig = validateConfig(rawConfig)
    } catch (error) {
        return showError(
            error instanceof Error
                ? error
                : new Error("releaseCli 配置验证失败，请检查配置格式"),
        )
    }

    const parsedConfig = getParsedConfigJsonData(JSON.stringify(mergedConfig))

    const isBranchBlacklisted = parsedConfig.branchBlacklist.some(
        (item: string | RegExp) => {
            if (item instanceof RegExp) {
                return item.test(curBranch)
            }
            return item === curBranch
        },
    )

    if (isBranchBlacklisted) {
        return showError(
            new Error(
                `当前分支 ${curBranch} 禁止发布，请切换到其他分支进行发布`,
            ),
        )
    }

    if (statusStdout) {
        return showError(
            new Error(
                `当前分支有未提交的文件，请先提交或暂存文件（使用 "git add ." 暂存所有文件）`,
            ),
        )
    }

    const { versions, curVersion } = getBumpVersions()
    const { bump, preRelease, customVersion } = await getPromptQuestions()

    if (customVersion && !semver.valid(customVersion)) {
        return showError(new Error("输入的版本号不规范，请重新输入"))
    }

    let version = customVersion || versions[bump]

    if (preRelease) {
        version = semver.inc(
            curVersion,
            ReleaseType.PRERELEASE as SemVerReleaseType,
            preRelease,
        )
    }

    const { yes } = await inquirer.prompt([
        {
            type: "confirm",
            name: "yes",
            message: `确定要发布 ${version} 版本?`,
        },
    ])

    if (!yes) {
        return
    }

    // 检查npm包输入该版本是否存在
    // 使用配置的 registry，默认使用淘宝镜像以提升速度
    const registry =
        mergedConfig.npmRegistry || "https://registry.npmmirror.com"
    const packageName = getPackageJson().name

    try {
        // 使用 --registry 参数指定镜像地址，避免修改全局 npm 配置
        const { stdout: npmPackageVersion } = execa.commandSync(
            `npm view ${packageName} version --registry=${registry}`,
            {
                timeout: 10000, // 设置 10 秒超时
            },
        )

        if (npmPackageVersion && semver.eq(version, npmPackageVersion)) {
            return showError(
                new Error(`npm包 ${packageName} 已存在该版本，请重新输入`),
            )
        }
    } catch (error) {
        // 如果查询失败（可能是网络问题或包不存在），记录警告但继续执行
        // 这样可以避免因为网络问题阻塞发布流程
        const errorMessage = error instanceof Error ? error.message : "未知错误"
        console.warn(
            `警告: 无法检查 npm 包版本 (${errorMessage})，将继续发布流程`,
        )
    }

    console.log("start read package.json")

    const pkgContent = JSON.parse(
        fs.readFileSync(getPackageJsonPath(), "utf-8"),
    )

    console.log("end read package.json")

    pkgContent.version = version

    console.log(pkgContent, "pkgContent")

    console.log("start write package.json")

    fs.writeFileSync(
        getPackageJsonPath(),
        `${JSON.stringify(
            pkgContent,
            null,
            mergedConfig.packageJsonFileIndent,
        )}\n`,
    )

    console.log("end write package.json")

    console.log("start changelog")

    await generateChangelog(version, mergedConfig)

    console.log("end changelog")

    if (mergedConfig.autoBuild) {
        await execa("npm", ["run", "build"], {
            stdio: "inherit",
            cwd: path.dirname(getPackageJsonPath()),
        })
    }
}

export default release
