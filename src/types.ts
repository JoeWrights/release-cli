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
    /**
     * 是否在发布前自动执行构建命令
     */
    autoBuild?: boolean
    /**
     * 是否自动创建并推送 Git tag
     */
    autoTag?: boolean
    /**
     * tag 前缀
     */
    tagPrefix?: string
    /**
     * Tag 后缀
     */
    tagSuffix?: string
    /**
     * 禁止发布的分支列表
     */
    branchBlacklist?: string[]
    /**
     * Commit Type 展示名称
     */
    commitTypeDisplayName?: Record<CommitType, string>
    /**
     * package.json 文件的缩进空格数
     */
    packageJsonFileIndent?: number
    /**
     * 生成多少个版本的 changelog
     * - 0: 生成所有版本（多个版本号）
     * - 1: 只生成最新一个版本（单个版本号，默认值）
     * - 2+: 生成最近 N 个版本
     */
    releaseCount?: number
}
