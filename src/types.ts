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
 * Release cli options
 */
export interface ReleaseCliOptions {
    autoBuild?: boolean
    autoTag?: boolean
    tagSuffix?: string
    branchBlacklist?: string[]
    packageJsonFileIndent?: number
}
