import { z } from "zod"

/**
 * Release CLI 配置 Schema
 */
export const releaseCliConfigSchema = z.object({
    /**
     * 是否在发布前自动执行构建命令
     */
    autoBuild: z.boolean().optional().default(true),

    /**
     * 是否自动创建并推送 Git tag
     */
    autoTag: z.boolean().optional().default(false),

    /**
     * Tag 后缀
     */
    tagSuffix: z.string().optional().default(""),

    /**
     * 禁止发布的分支列表
     * 支持字符串或正则表达式（以 / 开头和结尾的字符串会被解析为正则表达式）
     * 注意：在 JSON 配置中，正则表达式需要以字符串形式提供，例如 "/^release\\/.*$/"
     */
    branchBlacklist: z.array(z.string()).optional().default(["master", "main"]),

    /**
     * package.json 文件的缩进空格数
     */
    packageJsonFileIndent: z.number().int().positive().optional().default(4),
})

/**
 * Release CLI 配置类型（从 schema 推断）
 */
export type ReleaseCliConfig = z.infer<typeof releaseCliConfigSchema>

/**
 * 验证并解析配置
 * @param config 原始配置对象
 * @returns 验证后的配置对象
 */
export function validateConfig(config: unknown): ReleaseCliConfig {
    try {
        return releaseCliConfigSchema.parse(config)
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.issues
                .map((err: z.core.$ZodIssue) => {
                    const path = err.path.join(".")
                    return `  - ${path}: ${err.message}`
                })
                .join("\n")
            throw new Error(
                `配置验证失败:\n${errorMessages}\n\n请检查配置文件格式是否正确。`,
            )
        }
        throw error
    }
}

/**
 * 安全地验证配置（不抛出异常）
 * @param config 原始配置对象
 * @returns 验证结果，包含 success 和 data/error
 */
export function safeValidateConfig(config: unknown): {
    success: boolean
    data?: ReleaseCliConfig
    error?: string
} {
    const result = releaseCliConfigSchema.safeParse(config)
    if (result.success) {
        return { success: true, data: result.data }
    } else {
        const errorMessages = result.error.issues
            .map((err: z.core.$ZodIssue) => {
                const path = err.path.join(".")
                return `  - ${path}: ${err.message}`
            })
            .join("\n")
        return {
            success: false,
            error: `配置验证失败:\n${errorMessages}\n\n请检查配置是否正确。`,
        }
    }
}
