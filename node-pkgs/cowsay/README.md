# @ethan-utils/cowsay

一个简单的 Node.js 版本 cowsay 实现，灵感来源于经典的 Unix cowsay 工具。用于在命令行输出有趣的牛说话气泡，适合 CLI 工具、提示信息等场景。

## 安装

使用 pnpm 安装：

```bash
pnpm add @ethan-utils/cowsay
```

## 使用方法

```ts
import cowsay from "@ethan-utils/cowsay";

console.log(cowsay());
```

输出示例：

```
 ________________
< 本工具包助你高效开发！🚂🚂🚂 >
 ----------------
        \   ^__^
         \  (^^)\_______
            (__)\       )\/\
             U  ||----w |
                ||     ||
```

## 依赖

- [cowsay](https://www.npmjs.com/package/cowsay)

## 许可证

MIT
