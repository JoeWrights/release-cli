/**
 * Release type
 */
export enum ReleaseType {
    /**
     * Major 大版本
     */
    MAJOR = "major",
    /**
     * Minor 小版本
     */
    MINOR = "minor",
    /**
     * Patch 补丁版本
     */
    PATCH = "patch",
    /**
     * Prerelease 预发布
     */
    PRERELEASE = "prerelease",
    /**
     * Custom 自定义
     */
    CUSTOM = "custom",
}

/**
 * Pre release type
 */
export enum PreReleaseType {
    /**
     * Alpha 内测
     */
    ALPHA = "alpha",
    /**
     * Beta 公测
     */
    BETA = "beta",
    /**
     * RC 候选
     */
    RC = "rc",
    /**
     * Next 下一个
     */
    NEXT = "next",
    /**
     * Experimental 实验
     */
    EXPERIMENTAL = "experimental",
}

/**
 * Commit type
 * @see https://www.conventionalcommits.org/en/v1.0.0/
 * @see https://gitmoji.dev/
 */
export enum CommitType {
    /**
     * Features 功能
     */
    FEAT = "feat",
    /**
     * Bug fixes 修复
     */
    FIX = "fix",
    /**
     * Performance improvements 性能优化
     */
    PERF = "perf",
    /**
     * Code refactoring 代码重构
     */
    REFACTOR = "refactor",
    /**
     * Tests 测试
     */
    TEST = "test",
    /**
     * Build system 构建系统
     */
    BUILD = "build",
    /**
     * Continuous integration 持续集成
     */
    CI = "ci",
    /**
     * Reverts 回滚
     */
    REVERT = "revert",
    /**
     * Documentation 文档
     */
    DOCS = "docs",
    /**
     * Styles 样式
     */
    STYLE = "style",
    /**
     * Chores 杂项
     */
    CHORE = "chore",
    /**
     * Security 安全
     */
    SECURITY = "security",
    /**
     * Types (TypeScript, Flow, etc.) 类型
     */
    TYPES = "types",
    /**
     * Internationalization 国际化
     */
    I18N = "i18n",
    /**
     * Accessibility 无障碍
     */
    ACCESSIBILITY = "accessibility",
    /**
     * Dependencies 依赖
     */
    DEPS = "deps",
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
}
