import {
    array,
    boolean,
    defaulted,
    Infer,
    number,
    object,
    optional,
    string,
    StructError,
} from "superstruct"

/**
 * Release CLI 配置 Schema
 */
export const releaseCliConfigSchema = object({
    /**
     * 是否在发布前自动执行构建命令
     */
    autoBuild: defaulted(optional(boolean()), true),

    /**
     * 是否自动创建并推送 Git tag
     */
    autoTag: defaulted(optional(boolean()), false),

    /**
     * Tag 后缀,用于在 Git tag 中添加后缀
     */
    tagSuffix: defaulted(optional(string()), ""),

    /**
     * 禁止发布的分支列表
     * 支持字符串或正则表达式（以 / 开头和结尾的字符串会被解析为正则表达式）
     * 注意：在 JSON 配置中，正则表达式需要以字符串形式提供，例如 "/^release\\/.*$/"
     */
    branchBlacklist: defaulted(optional(array(string())), ["master", "main"]),

    /**
     * package.json 文件的缩进空格数
     */
    packageJsonFileIndent: defaulted(optional(number()), 4),
})

/**
 * Release CLI 配置类型（从 schema 推断）
 */
export type ReleaseCliConfig = Infer<typeof releaseCliConfigSchema>

/**
 * 验证并解析配置
 * @param config 原始配置对象
 * @returns 验证后的配置对象
 */
export function validateConfig(config: unknown): ReleaseCliConfig {
    try {
        return releaseCliConfigSchema.create(config)
    } catch (error) {
        if (
            error instanceof StructError &&
            typeof error.failures === "function"
        ) {
            const failures = error.failures()
            if (Array.isArray(failures) && failures.length > 0) {
                const errorMessages = failures
                    .map((failure) => {
                        const path = Array.isArray(failure.path)
                            ? failure.path.join(".")
                            : failure.path || "root"
                        return `  - ${path}: ${failure.message ||
                            failure.explanation ||
                            "验证失败"}`
                    })
                    .join("\n")
                throw new Error(
                    `配置验证失败:\n${errorMessages}\n\n请检查配置文件格式是否正确。`,
                )
            }
        }
        // 如果没有 failures，使用错误消息
        throw new Error(
            `配置验证失败: ${(error instanceof Error && error?.message) ||
                "未知错误"}\n\n请检查配置文件格式是否正确。`,
        )
    }
}

/**
 * 安全地验证配置（不抛出异常）
 * @param config 原始配置对象
 * @returns 验证结果，包含 success 和 data/error
 */
export function safeValidateConfig(
    config: unknown,
): {
    success: boolean
    data?: ReleaseCliConfig
    error?: string
} {
    try {
        const data = releaseCliConfigSchema.create(config)
        return { success: true, data }
    } catch (error) {
        if (
            error instanceof StructError &&
            typeof error.failures === "function"
        ) {
            const failures = error.failures()
            if (Array.isArray(failures) && failures.length > 0) {
                const errorMessages = failures
                    .map((failure) => {
                        const path = Array.isArray(failure.path)
                            ? failure.path.join(".")
                            : failure.path || "root"
                        return `  - ${path}: ${failure.message ||
                            failure.explanation ||
                            "验证失败"}`
                    })
                    .join("\n")
                return {
                    success: false,
                    error: `配置验证失败:\n${errorMessages}\n\n请检查配置是否正确。`,
                }
            }
        }
        return {
            success: false,
            error: (error instanceof Error && error.message) || "配置验证失败",
        }
    }
}
