# @joewrights/release-cli

一个用于自动化项目发布流程的 CLI 工具，支持版本号管理、自动生成 changelog、自动构建和 Git 操作等。

## 功能特性

-   🚀 **版本号管理**：支持 major、minor、patch、prelease 和自定义版本号
-   📝 **自动生成 Changelog**：基于 conventional-changelog 自动生成更新日志
-   🔨 **自动构建**：可配置是否在发布前自动执行构建命令
-   🏷️ **自动打 Tag**：可配置是否自动创建并推送 Git tag
-   🛡️ **安全检查**：检查 Git 状态、分支黑名单、npm 包版本冲突等
-   ⚙️ **灵活配置**：支持通过配置文件或 package.json 进行配置

## 安装

```bash
# 使用 npm
npm install -g @joewrights/release-cli

# 使用 yarn
yarn global add @joewrights/release-cli

# 使用 pnpm
pnpm add -g @joewrights/release-cli
```

## 使用方法

### 基本使用

在项目根目录下运行：

```bash
release-cli
```

### 命令行选项

```bash
# 查看版本号
release-cli -v
# 或
release-cli --version

# 指定配置文件
release-cli -c release.config.js
# 或
release-cli --config release.config.js
```

## 配置

### 方式一：在 package.json 中配置

在 `package.json` 中添加 `releaseCliConfig` 字段：

```json
{
    "name": "your-package",
    "version": "1.0.0",
    "releaseCliConfig": {
        "autoBuild": true,
        "autoTag": false,
        "tagSuffix": "",
        "branchBlacklist": ["master", "main"],
        "packageJsonFileIndent": 4
    }
}
```

### 方式二：使用配置文件

创建 `release.config.js` 文件：

```javascript
module.exports = {
    autoBuild: true,
    autoTag: false,
    tagSuffix: "",
    branchBlacklist: ["master", "main"],
    packageJsonFileIndent: 4,
}
```

或者使用函数形式：

```javascript
module.exports = () => {
    return {
        autoBuild: true,
        autoTag: false,
        tagSuffix: "",
        branchBlacklist: ["master", "main"],
        packageJsonFileIndent: 4,
    }
}
```

### 配置选项说明

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `autoBuild` | `boolean` | `true` | 是否在发布前自动执行 `npm run build` |
| `autoTag` | `boolean` | `false` | 是否自动创建并推送 Git tag |
| `tagSuffix` | `string` | `""` | Tag 后缀，例如：`-stable` |
| `branchBlacklist` | `string[] \| RegExp[]` | `["master", "main"]` | 禁止发布的分支列表，支持正则表达式 |
| `packageJsonFileIndent` | `number` | `4` | package.json 文件的缩进空格数 |

### 分支黑名单示例

```javascript
{
    branchBlacklist: [
        "master",
        "main",
        "/^release\\/.*$/", // 使用正则表达式匹配所有 release/* 分支
    ]
}
```

## 发布流程

1. **环境检查**

    - 检查是否存在 `package.json` 文件
    - 检查是否在 Git 仓库中
    - 检查当前分支是否在黑名单中
    - 检查是否有未提交的文件

2. **版本选择**

    - 选择版本类型（major、minor、patch、prelease、custom）
    - 如果选择 prelease，需要选择预发布类型（alpha、beta、rc、next、experimental）
    - 如果选择 custom，需要输入自定义版本号

3. **版本验证**

    - 验证版本号格式
    - 检查 npm 包是否已存在该版本

4. **执行发布**
    - 更新 `package.json` 中的版本号
    - 生成 `CHANGELOG.md`
    - 提交更改到 Git
    - 推送到远程仓库
    - 如果启用 `autoBuild`，执行构建命令
    - 如果启用 `autoTag`，创建并推送 Git tag

## 版本类型说明

-   **major（大版本）**：可能包含不兼容的变更，例如 `1.0.0` → `2.0.0`
-   **minor（小版本）**：可能包含新的功能或优化，例如 `1.0.0` → `1.1.0`
-   **patch（补丁版本）**：兼容老版本，只是修复一些 bug，例如 `1.0.0` → `1.0.1`
-   **prelease（预发布版本）**：预发布版本，例如 `1.0.0` → `1.0.1-alpha.0`
-   **custom（自定义版本）**：手动输入版本号

## 预发布类型

-   **alpha**：内测版本
-   **beta**：公测版本
-   **rc**：候选版本
-   **next**：下一个版本
-   **experimental**：实验版本

## 注意事项

1. 确保项目已初始化 Git 仓库
2. 发布前确保所有更改已提交（工具会自动检查）
3. 确保当前分支不在黑名单中
4. 如果启用了 `autoBuild`，确保项目中有 `build` 脚本
5. 生成的 changelog 基于 [Conventional Commits](https://www.conventionalcommits.org/) 规范

## 开发

```bash
# 克隆项目
git clone <repository-url>

# 安装依赖
pnpm install

# 构建
pnpm build

# 代码检查
pnpm lint

# 代码格式化
pnpm format
```

## License

MIT

## 作者

Joe Wright (1035208578@qq.com)
