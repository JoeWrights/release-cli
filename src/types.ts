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
}
