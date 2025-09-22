# @ethan-utils/pay-gateway

## 1.2.5

### Patch Changes

- 4e45b5e: 修复 h5 h5jump 支付接口路径错误问题

## 1.2.4

### Patch Changes

- 44e7c72: 优化项目稳定性(hot refactor)

## 1.2.3

### Patch Changes

- a7de2e8: 优化导出类型反馈

## 1.2.2

### Patch Changes

- 9fe9d5a: 修复蓝兔支付不正确返回类型

## 1.2.1

### Patch Changes

- 7562468: 修复蓝兔支付支付签名问题(hotfix)

## 1.2.0

### Minor Changes

- 9bd3fd2: 新增功能支付接口可传入 notify_url 或 return_url 来覆盖默认初始化的配置.

## 1.1.7

### Patch Changes

- 62aca7b: 修复了导致 "undefined" is not valid JSON 错误的问题。

## 1.1.6

### Patch Changes

- c9d7c52: 添加更多输出日志

## 1.1.5

### Patch Changes

- 6070fb2: 修复无法使用(使用 form 传数据而非 json, body),新增时间戳

## 1.1.4

### Patch Changes

- 6bf6d04: 修复 mch_id 未传入问题

## 1.1.3

### Patch Changes

- 8f5d529: 修复一些问题

## 1.1.2

### Patch Changes

- f64fe87: 修复一些问题

## 1.1.1

### Patch Changes

- dd7172d: 修复 tsconfig 中 module 处于 commonjs 情况下无法通过包/xx 导入的问题,更换使用方式

## 1.1.0

### Minor Changes

- 0b15508: 支持 commonjs 项目

## 1.0.0

### Major Changes

- 4a6408d: 支付网关支付 SDK 与大家见面啦, 首版发布, 采用现代化开发理念让您更轻松对接支付功能, 支持 蓝兔支付 和 7Pay 支付.
