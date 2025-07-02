# ethan-utils

`ethan-utils` 是一个基于 pnpm 的 monorepo 工具库集合，旨在为前端/Node.js 项目提供高效、易用的工具包。所有子包均托管于 npm，可在 [ethan-utils npm 包列表](https://www.npmjs.com/settings/ethan-utils/packages) 查看。

## 仓库结构与子包说明

本仓库包含多个独立的工具包，涵盖状态管理、请求库、命令行工具等，便于统一管理和复用。具体包信息请访问上述链接。

**模板包说明：**

仓库内提供了一个基础模板包 [`template-pkg`](./template-pkg)，适用于快速创建新工具包。模板包内包含 TypeScript 配置、基础构建脚本（Rolldown）、最小化包结构，适合直接复制后进行二次开发。

## 使用方式

各子包均可独立安装和使用，具体用法请参考各自子包下的 README.md。

**如何基于模板包创建新包：**

1. 复制 `template-pkg` 文件夹并重命名为你的新包名（如 `my-utils`）。
2. 修改 `package.json`、`README.md`、`index.ts` 等文件内容，替换为你的包信息和实现。
3. 构建之前包中用到的外部依赖需要在 `rolldown` 配置文件的 `external` 项写明，传入字符串即可。
4. `generate-types` 和 `build` 脚本分别用于生成类型文件，Maps，打包代码。
5. 按照项目规范开发并构建发布。

## 依赖与开发

- 包管理工具：pnpm
- 代码规范：ESLint、Prettier、Commitlint
- 构建工具：Rolldown、tsc
- 其他依赖详见 package.json

## 贡献

欢迎 issue 和 PR，详细贡献指南请见 [CONTRIBUTING.md](./CONTRIBUTING.md)。
