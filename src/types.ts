/**
 * Release type
 */
export enum ReleaseType {
    MAJOR = "major",
    MINOR = "minor",
    PATCH = "patch",
    PRERELEASE = "prerelease",
    CUSTOM = "custom",
}

/**
 * Pre release type
 */
export enum PreReleaseType {
    ALPHA = "alpha",
    BETA = "beta",
    RC = "rc",
    NEXT = "next",
    EXPERIMENTAL = "experimental",
}

/**
 * Commit type
 * @see https://www.conventionalcommits.org/en/v1.0.0/
 */
export enum CommitType {
    /**
     * Features
     */
    FEAT = "feat",
    /**
     * Bug fixes
     */
    FIX = "fix",
    /**
     * Performance improvements
     */
    PERF = "perf",
    /**
     * Code refactoring
     */
    REFACTOR = "refactor",
    /**
     * Tests
     */
    TEST = "test",
    /**
     * Build system
     */
    BUILD = "build",
    /**
     * Continuous integration
     */
    CI = "ci",
    /**
     * Reverts
     */
    REVERT = "revert",
    /**
     * Documentation
     */
    DOCS = "docs",
    /**
     * Styles
     */
    STYLE = "style",
    /**
     * Chores
     */
    CHORE = "chore",
}

/**
 * Release cli options
 */
export interface ReleaseCliOptions {
    autoBuild?: boolean
    autoTag?: boolean
    tagSuffix?: string
    branchBlacklist?: string[]
    packageJsonFileIndent?: number
    /**
     * 生成多少个版本的 changelog
     * - 0: 生成所有版本（多个版本号）
     * - 1: 只生成最新一个版本（单个版本号，默认值）
     * - 2+: 生成最近 N 个版本
     */
    releaseCount?: number
}
