import { PreReleaseType, ReleaseType } from "./types"

/**
 * Bumps
 */
export const BUMPS = [
    {
        type: ReleaseType.MAJOR,
        intro: "大版本更新,可能包含不兼容的变更",
    },
    {
        type: ReleaseType.MINOR,
        intro: "小版本更新,可能包含新的功能或优化",
    },
    {
        type: ReleaseType.PATCH,
        intro: "补丁版本更新,兼容老版本，只是修复一些bug",
    },
    {
        type: ReleaseType.PRERELEASE,
        intro: "预发布版本",
    },
]

/**
 * Pre release
 */
export const PRE_RELEASE = [
    {
        type: PreReleaseType.ALPHA,
        intro: "内测(alpha)",
    },
    {
        type: PreReleaseType.BETA,
        intro: "公测(beta)",
    },
    {
        type: PreReleaseType.RC,
        intro: "候选(rc)",
    },
    {
        type: PreReleaseType.NEXT,
        intro: "下一个(next)",
    },
    {
        type: PreReleaseType.EXPERIMENTAL,
        intro: "实验(experimental)",
    },
]

console.log(PRE_RELEASE, "PRE_RELEASE")
