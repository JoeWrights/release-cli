import { CommitType, PreReleaseType, ReleaseType } from "./types"

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

/**
 * Commit types display name
 * @see https://www.conventionalcommits.org/en/v1.0.0/
 * @see https://gitmoji.dev/
 */
export const COMMIT_TYPES_DISPLAY_NAME: Record<CommitType, string> = {
    [CommitType.FEAT]: "Features",
    [CommitType.FIX]: "Bug Fixes",
    [CommitType.PERF]: "Performance Improvements",
    [CommitType.REFACTOR]: "Code Refactoring",
    [CommitType.TEST]: "Tests",
    [CommitType.BUILD]: "Build System",
    [CommitType.CI]: "Continuous Integration",
    [CommitType.REVERT]: "Reverts",
    [CommitType.DOCS]: "Documentation",
    [CommitType.STYLE]: "Styles",
    [CommitType.CHORE]: "Chores",
    [CommitType.SECURITY]: "Security",
    [CommitType.TYPES]: "Types",
    [CommitType.I18N]: "Internationalization",
    [CommitType.ACCESSIBILITY]: "Accessibility",
    [CommitType.DEPS]: "Dependencies",
}
