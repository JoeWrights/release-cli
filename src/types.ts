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
     * Styles 表示代码样式修改的提交，如不影响程序逻辑的修改（例如空格、格式、缺少分号等）
     */
    STYLE = "style",
    /**
     * UI 表示用户界面相关的提交，如样式修改、动画效果等
     */
    UI = "ui",
    /**
     * Chores 杂项，不涉及到任何代码修改的提交，如更新依赖、更新配置文件等
     */
    CHORE = "chore",
    /**
     * Security 安全，与安全性相关的提交，如修复安全漏洞、加密数据等
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
     * Dependencies 依赖，如更新依赖、删除依赖等
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
     * tag 后缀
     */
    tagSuffix?: string
    /**
     * npm registry 地址
     * 默认使用淘宝镜像：https://registry.npmmirror.com
     * 也可以使用其他镜像，如：https://registry.npmjs.org
     */
    npmRegistry?: string
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
