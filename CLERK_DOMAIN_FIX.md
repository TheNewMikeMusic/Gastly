# Clerk 自定义域名错误修复指南

## 问题描述

错误信息：`GET https://clerk.hello1984.net/npm/@clerk/clerk-js@5/dist/clerk.browser.js net::ERR_CONNECTION_CLOSED`

## 原因

Clerk 的 publishable key (`pk_live_Y2xlcmsuaGVsbG8xOTg0Lm5ldCQ`) 中包含了自定义域名 `clerk.hello1984.net`，但该域名没有正确配置 DNS 或 SSL 证书。

## 解决方案

### 方案 1：移除自定义域名（推荐，最简单）

1. 登录 [Clerk Dashboard](https://dashboard.clerk.com)
2. 选择你的应用
3. 进入 **Settings** > **Domains**
4. 找到 `clerk.hello1984.net` 自定义域名
5. 点击 **Remove** 或 **Delete**
6. 确认删除
7. 重新生成 publishable key（如果需要）
8. 更新服务器上的 `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` 环境变量

### 方案 2：正确配置自定义域名 DNS

1. 登录 [Clerk Dashboard](https://dashboard.clerk.com)
2. 选择你的应用
3. 进入 **Settings** > **Domains**
4. 找到 `clerk.hello1984.net` 自定义域名
5. 查看 Clerk 提供的 CNAME 记录（例如：`clerk.hello1984.net -> xxxxx.clerk.accounts.dev`）
6. 在你的域名注册商（如 Cloudflare、Namecheap 等）中添加 CNAME 记录：
   - **Type**: CNAME
   - **Name**: clerk
   - **Value**: [Clerk 提供的 CNAME 目标]
   - **TTL**: 3600（或自动）
7. 等待 DNS 传播（通常几分钟到几小时）
8. Clerk 会自动生成 SSL 证书（可能需要几分钟）

### 方案 3：临时使用默认域名（代码修复）

如果无法立即修复 DNS，可以在代码中强制使用默认的 Clerk 域名。但这需要修改 publishable key，可能不是最佳解决方案。

## 验证修复

修复后，访问 https://hello1984.net/sign-in，检查浏览器控制台：
- ✅ 应该看到 Clerk 从 `*.clerk.accounts.dev` 加载资源（如果移除了自定义域名）
- ✅ 或者从 `clerk.hello1984.net` 成功加载资源（如果配置了 DNS）
- ❌ 不应该再看到 `ERR_CONNECTION_CLOSED` 错误

## 注意事项

- 如果使用自定义域名，必须正确配置 DNS CNAME 记录
- SSL 证书由 Clerk 自动管理，但需要 DNS 正确配置后才能生成
- 修改域名配置后，可能需要等待几分钟才能生效

