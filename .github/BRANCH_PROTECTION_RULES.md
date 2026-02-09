# GitHub 分支保护规则配置指南

本文档详细说明了与 GitFlow 工作流配合使用的 GitHub 分支保护规则配置。

## 📋 目录

- [环境配置](#环境配置)
- [分支保护规则](#分支保护规则)
  - [main 分支](#main-分支生产环境)
  - [develop 分支](#develop-分支开发环境)
  - [release/* 分支](#release-分支预发布环境)
  - [hotfix/* 分支](#hotfix-分支紧急修复)
  - [feature/* 分支](#feature-分支功能开发)
- [规则说明](#规则说明)
- [配置步骤](#配置步骤)

---

## 环境配置

在配置分支保护规则之前，需要先在 GitHub 仓库中创建以下环境：

### 创建环境步骤

1. 进入仓库 → **Settings** → **Environments**
2. 点击 **New environment** 创建以下环境：

| 环境名称 | 用途 | 需要审批 |
|---------|------|---------|
| `development` | 开发环境 | ❌ 否 |
| `staging` | 预发布/测试环境 | ✅ 是 |
| `production` | 生产环境 | ✅ 是 |

### 环境保护规则配置

#### Development 环境
- **Required reviewers**: 不需要
- **Wait timer**: 0 分钟
- **Deployment branches**: `develop`, `feature/*`

#### Staging 环境
- **Required reviewers**: 至少 1 人（建议：QA 或技术负责人）
- **Wait timer**: 0 分钟（可选 5-10 分钟冷却期）
- **Deployment branches**: `release/*`, `hotfix/*`

#### Production 环境
- **Required reviewers**: 至少 2 人（建议：技术负责人 + 产品负责人）
- **Wait timer**: 建议 10-30 分钟（生产部署冷却期）
- **Deployment branches**: `main`, `hotfix/*`

---

## 分支保护规则

### main 分支（生产环境）

**路径**: Settings → Branches → Add branch protection rule

**Branch name pattern**: `main`

#### ✅ 需要勾选的规则

| 规则 | 设置 | 说明 |
|-----|------|------|
| **Require a pull request before merging** | ✅ 勾选 | 禁止直接推送，必须通过 PR |
| ├─ Require approvals | ✅ 勾选 | 需要审批 |
| ├─ Required number of approvals | `2` | 至少 2 人审批 |
| ├─ Dismiss stale pull request approvals | ✅ 勾选 | 新提交后清除旧的审批 |
| ├─ Require review from Code Owners | ✅ 勾选 | 需要代码所有者审批 |
| ├─ Require approval of the most recent reviewable push | ✅ 勾选 | 最新提交需要重新审批 |
| **Require status checks to pass** | ✅ 勾选 | 必须通过 CI 检查 |
| ├─ Require branches to be up to date | ✅ 勾选 | 分支必须是最新的 |
| ├─ Status checks: `build` | ✅ 添加 | 构建必须成功 |
| **Require conversation resolution** | ✅ 勾选 | 所有评论必须解决 |
| **Require signed commits** | ⚠️ 可选 | 要求签名提交（推荐） |
| **Require linear history** | ✅ 勾选 | 要求线性历史（禁止 merge commit） |
| **Do not allow bypassing the above settings** | ✅ 勾选 | 管理员也不能绕过 |
| **Restrict who can push to matching branches** | ✅ 勾选 | 限制推送权限 |
| **Allow force pushes** | ❌ 不勾选 | 禁止强制推送 |
| **Allow deletions** | ❌ 不勾选 | 禁止删除分支 |

---

### develop 分支（开发环境）

**Branch name pattern**: `develop`

#### ✅ 需要勾选的规则

| 规则 | 设置 | 说明 |
|-----|------|------|
| **Require a pull request before merging** | ✅ 勾选 | 禁止直接推送 |
| ├─ Require approvals | ✅ 勾选 | 需要审批 |
| ├─ Required number of approvals | `1` | 至少 1 人审批 |
| ├─ Dismiss stale pull request approvals | ✅ 勾选 | 新提交后清除旧审批 |
| ├─ Require review from Code Owners | ⚠️ 可选 | 根据团队情况决定 |
| **Require status checks to pass** | ✅ 勾选 | 必须通过 CI 检查 |
| ├─ Require branches to be up to date | ✅ 勾选 | 分支必须是最新的 |
| ├─ Status checks: `lint-and-build` | ✅ 添加 | CI 检查必须通过 |
| **Require conversation resolution** | ✅ 勾选 | 所有评论必须解决 |
| **Require signed commits** | ❌ 不勾选 | 开发环境可以放宽 |
| **Require linear history** | ⚠️ 可选 | 根据团队习惯决定 |
| **Allow force pushes** | ❌ 不勾选 | 禁止强制推送 |
| **Allow deletions** | ❌ 不勾选 | 禁止删除分支 |

---

### release/* 分支（预发布环境）

**Branch name pattern**: `release/**` 或 `release/*`

#### ✅ 需要勾选的规则

| 规则 | 设置 | 说明 |
|-----|------|------|
| **Require a pull request before merging** | ✅ 勾选 | 合并到 main 时需要 PR |
| ├─ Require approvals | ✅ 勾选 | 需要审批 |
| ├─ Required number of approvals | `1` | 至少 1 人审批 |
| ├─ Dismiss stale pull request approvals | ✅ 勾选 | 新提交后清除旧审批 |
| **Require status checks to pass** | ✅ 勾选 | 必须通过 CI 检查 |
| ├─ Status checks: `build` | ✅ 添加 | 构建必须成功 |
| **Require conversation resolution** | ✅ 勾选 | 所有评论必须解决 |
| **Allow force pushes** | ❌ 不勾选 | 禁止强制推送 |
| **Allow deletions** | ✅ 勾选 | 发布后可以删除 |

> **注意**: Release 分支在发布完成后通常会被删除，因此允许删除。

---

### hotfix/* 分支（紧急修复）

**Branch name pattern**: `hotfix/**` 或 `hotfix/*`

#### ✅ 需要勾选的规则

| 规则 | 设置 | 说明 |
|-----|------|------|
| **Require a pull request before merging** | ✅ 勾选 | 合并需要 PR |
| ├─ Require approvals | ✅ 勾选 | 需要审批 |
| ├─ Required number of approvals | `1` | 至少 1 人审批（紧急情况可快速审批） |
| ├─ Dismiss stale pull request approvals | ❌ 不勾选 | 紧急修复时允许保留审批 |
| **Require status checks to pass** | ✅ 勾选 | 必须通过 CI 检查 |
| ├─ Status checks: `build` | ✅ 添加 | 构建必须成功 |
| **Require conversation resolution** | ⚠️ 可选 | 紧急情况可放宽 |
| **Allow force pushes** | ❌ 不勾选 | 禁止强制推送 |
| **Allow deletions** | ✅ 勾选 | 修复后可以删除 |

> **注意**: Hotfix 分支的规则相对宽松，以便快速响应生产问题。

---

### feature/* 分支（功能开发）

**Branch name pattern**: `feature/**` 或 `feature/*`

#### ✅ 需要勾选的规则

| 规则 | 设置 | 说明 |
|-----|------|------|
| **Require a pull request before merging** | ❌ 不勾选 | feature 分支可以自由提交 |
| **Require status checks to pass** | ⚠️ 可选 | 可以不强制要求 |
| **Allow force pushes** | ✅ 勾选 | 允许开发者整理提交历史 |
| **Allow deletions** | ✅ 勾选 | 功能完成后可以删除 |

> **注意**: Feature 分支通常不需要保护，开发者可以自由操作。保护规则应该在合并到 develop 时生效。

---

## 规则说明

### 常用规则详解

| 规则名称 | 作用 | 建议使用场景 |
|---------|------|-------------|
| **Require a pull request before merging** | 禁止直接推送，必须通过 PR 合并 | main, develop |
| **Require approvals** | PR 需要指定数量的审批才能合并 | 所有保护分支 |
| **Dismiss stale pull request approvals** | 有新提交时，之前的审批会失效 | main, develop |
| **Require review from Code Owners** | 需要 CODEOWNERS 文件中指定的人员审批 | main |
| **Require status checks to pass** | CI/CD 检查必须通过 | 所有保护分支 |
| **Require branches to be up to date** | 合并前必须同步最新代码 | main, develop |
| **Require conversation resolution** | PR 中的所有评论都必须标记为已解决 | main, develop |
| **Require signed commits** | 要求使用 GPG 签名提交 | main（高安全要求） |
| **Require linear history** | 禁止 merge commit，保持线性历史 | main |
| **Do not allow bypassing** | 即使管理员也不能绕过规则 | main |
| **Restrict who can push** | 限制可以推送的人员或团队 | main |
| **Allow force pushes** | 允许强制推送（覆盖历史） | feature/* |
| **Allow deletions** | 允许删除分支 | feature/*, release/*, hotfix/* |

---

## 配置步骤

### 1. 进入分支保护设置

```
Repository → Settings → Branches → Add branch protection rule
```

### 2. 配置 main 分支保护

1. 在 "Branch name pattern" 输入: `main`
2. 按照上表勾选相应规则
3. 点击 "Create" 或 "Save changes"

### 3. 配置 develop 分支保护

1. 点击 "Add rule"
2. 在 "Branch name pattern" 输入: `develop`
3. 按照上表勾选相应规则
4. 保存

### 4. 配置 release 分支保护

1. 点击 "Add rule"
2. 在 "Branch name pattern" 输入: `release/**`
3. 按照上表勾选相应规则
4. 保存

### 5. 配置 hotfix 分支保护

1. 点击 "Add rule"
2. 在 "Branch name pattern" 输入: `hotfix/**`
3. 按照上表勾选相应规则
4. 保存

---

## 可选配置

### CODEOWNERS 文件

创建 `.github/CODEOWNERS` 文件来定义代码所有者：

```
# 默认所有者
* @team-lead @senior-dev

# 前端代码
/src/ @frontend-team

# CI/CD 配置
/.github/ @devops-team

# 文档
/docs/ @tech-writer
```

### Rulesets（新功能）

GitHub 现在支持 Rulesets，这是分支保护规则的增强版本：

1. 进入 Settings → Rules → Rulesets
2. 可以创建更灵活的规则集
3. 支持按组织级别配置
4. 支持更细粒度的控制

---

## 快速检查清单

### main 分支 ✅
- [x] 需要 PR 合并
- [x] 需要 2 人审批
- [x] 需要 CI 通过
- [x] 需要评论解决
- [x] 禁止强制推送
- [x] 禁止删除

### develop 分支 ✅
- [x] 需要 PR 合并
- [x] 需要 1 人审批
- [x] 需要 CI 通过
- [x] 禁止强制推送
- [x] 禁止删除

### release/* 分支 ✅
- [x] 需要 1 人审批
- [x] 需要 CI 通过
- [x] 禁止强制推送
- [x] 允许删除

### hotfix/* 分支 ✅
- [x] 需要 1 人审批
- [x] 需要 CI 通过
- [x] 禁止强制推送
- [x] 允许删除

### feature/* 分支 ✅
- [x] 允许自由开发
- [x] 允许强制推送
- [x] 允许删除

---

## 相关链接

- [GitHub 官方文档 - 分支保护规则](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub 官方文档 - 环境配置](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
- [GitFlow 工作流介绍](https://nvie.com/posts/a-successful-git-branching-model/)
