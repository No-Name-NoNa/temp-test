# 项目开发流程与部署指南

本文档详细介绍了本仓库的 Gitflow 工作流程、GitHub Actions 自动化配置，以及如何配置 GitHub Pages 静态网页部署。

---

## 目录

1. [GitHub Pages 静态网页配置](#github-pages-静态网页配置)
2. [Gitflow 工作流程介绍](#gitflow-工作流程介绍)
3. [GitHub Actions 工作流说明](#github-actions-工作流说明)
4. [常见场景操作指南](#常见场景操作指南)
   - [添加新功能](#场景一添加新功能)
   - [预发布流程](#场景二预发布流程)
   - [生产环境部署](#场景三生产环境部署)
   - [生产环境紧急修复](#场景四生产环境出现严重错误hotfix)

---

## GitHub Pages 静态网页配置

### 1. 启用 GitHub Pages

要启用 GitHub Pages，请按照以下步骤操作：

1. 进入仓库的 **Settings** 页面
2. 在左侧菜单中找到 **Pages**
3. 在 **Source** 下选择 **GitHub Actions**
4. 保存设置

### 2. 自动部署机制

本仓库配置了自动部署工作流 (`.github/workflows/deploy-pages.yml`)，当在 `main` 分支创建符合版本规范的 tag 时会自动触发部署。

**触发条件：**
- 创建以 `v` 开头的 tag（如 `v1.0.0`、`v2.1.3`、`v1` 等）

**创建 Tag 并触发部署：**

```bash
# 确保在 main 分支上
git checkout main
git pull origin main

# 创建 tag
git tag v1.0.0

# 推送 tag 到远程仓库，触发自动部署
git push origin v1.0.0
```

### 3. 部署后访问地址

部署成功后，可以通过以下地址访问静态网页：

```
https://<username>.github.io/<repo-name>/
```

例如：`https://No-Name-NoNa.github.io/temp-test/`

### 4. Vite 配置说明

为了支持 GitHub Pages 部署，`vite.config.ts` 中配置了 `base` 路径：

```typescript
export default defineConfig({
  plugins: [vue()],
  // 配置 base 路径，用于 GitHub Pages 部署
  // 可以通过 VITE_BASE_PATH 环境变量自定义，默认为仓库名 /temp-test/
  base: process.env.GITHUB_PAGES === 'true' 
    ? (process.env.VITE_BASE_PATH || '/temp-test/') 
    : '/',
})
```

在 GitHub Actions 构建时会自动设置 `GITHUB_PAGES` 环境变量为 `true`，确保构建产物的资源路径正确。

---

## Gitflow 工作流程介绍

本仓库采用 Gitflow 工作流程，包含以下主要分支类型：

### 分支类型说明

| 分支类型 | 分支命名规范 | 用途 | 生命周期 |
|---------|------------|------|---------|
| **main** | `main` | 生产环境代码，始终保持可部署状态 | 永久 |
| **develop** | `develop` | 开发主干，集成最新开发代码 | 永久 |
| **feature** | `feature/<功能名>` | 新功能开发 | 临时（合并后删除） |
| **release** | `release/<版本号>` | 预发布版本，用于测试和修复 | 临时（合并后删除） |
| **hotfix** | `hotfix/<修复名>` | 生产环境紧急修复 | 临时（合并后删除） |
| **bugfix** | `bugfix/<问题名>` | 开发阶段 bug 修复 | 临时（合并后删除） |

### 分支流程图

```
                    main (生产)
                      │
         ┌────────────┼────────────┐
         │            │            │
    hotfix/*      release/*        │
         │            │            │
         │            ▼            │
         │     ┌──────────┐        │
         │     │ staging  │        │
         │     └──────────┘        │
         │            │            │
         ▼            ▼            │
    ┌─────────────────────────────────┐
    │          develop (开发)          │
    └─────────────────────────────────┘
              │           │
         feature/*   bugfix/*
```

---

## GitHub Actions 工作流说明

本仓库配置了多个 GitHub Actions 工作流，对应不同的开发场景：

### 工作流文件列表

| 文件名 | 触发条件 | 主要功能 |
|-------|---------|---------|
| `ci.yml` | feature/\*、bugfix/\*、develop 分支推送 | 代码检查和构建 |
| `develop.yml` | develop 分支推送 | 自动部署到开发环境 |
| `release.yml` | release/\* 分支推送 | 部署到预发布环境（需手动批准） |
| `production.yml` | main 分支推送 | 部署到生产环境（需手动批准） |
| `hotfix.yml` | hotfix/\* 分支推送 | 紧急修复部署流程 |
| `deploy-pages.yml` | 创建 v* 标签 | 部署到 GitHub Pages |
| `manual-deploy.yml` | 手动触发 | 手动选择环境部署 |

### 环境配置

本项目配置了三个部署环境：

1. **development** - 开发环境
   - 自动部署，无需审批
   - 用于日常开发测试

2. **staging** - 预发布环境
   - 需要手动审批
   - 用于发布前的最终测试

3. **production** - 生产环境
   - 需要手动审批
   - 正式发布使用

4. **github-pages** - GitHub Pages
   - 自动部署
   - 用于静态网页展示

---

## 常见场景操作指南

### 场景一：添加新功能

当需要开发新功能时，请按照以下流程操作：

#### 步骤 1：创建 Feature 分支

```bash
# 从 develop 分支创建新的 feature 分支
git checkout develop
git pull origin develop
git checkout -b feature/my-new-feature
```

#### 步骤 2：开发功能

在 feature 分支上进行开发，定期提交代码：

```bash
git add .
git commit -m "feat: 实现xxx功能"
git push origin feature/my-new-feature
```

**此时 GitHub Actions 会自动触发：**
- `ci.yml` 工作流：执行代码检查和构建，确保代码质量

#### 步骤 3：创建 Pull Request

功能开发完成后，创建 Pull Request 合并到 `develop` 分支：

1. 在 GitHub 上点击 "New Pull Request"
2. 选择 `develop` 作为 base 分支
3. 选择 `feature/my-new-feature` 作为 compare 分支
4. 填写 PR 描述，请求 Code Review

**此时 GitHub Actions 会自动触发：**
- `ci.yml` 工作流：对 PR 进行自动检查

#### 步骤 4：合并到 develop

Code Review 通过后，合并 PR 到 `develop` 分支。

**此时 GitHub Actions 会自动触发：**
- `develop.yml` 工作流：自动部署到开发环境

#### 步骤 5：清理分支

```bash
# 删除本地 feature 分支
git checkout develop
git branch -d feature/my-new-feature

# 删除远程 feature 分支
git push origin --delete feature/my-new-feature
```

#### 完整流程图

```
┌─────────────────────────────────────────────────────────────────┐
│                        添加新功能流程                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   develop ─────────────────────────────────────→ develop        │
│       │                                             ▲           │
│       │ checkout -b feature/xxx                    │           │
│       ▼                                             │           │
│   feature/xxx ───┬──────────────────────────────────┘           │
│                  │                                              │
│            [CI 检查]                                            │
│                  │                                              │
│            [创建 PR]                                            │
│                  │                                              │
│            [Code Review]                                        │
│                  │                                              │
│            [合并 PR]                                            │
│                  │                                              │
│        [自动部署到开发环境]                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 场景二：预发布流程

当准备发布新版本时，需要创建 release 分支进行预发布测试：

#### 步骤 1：创建 Release 分支

```bash
# 从 develop 分支创建 release 分支
git checkout develop
git pull origin develop
git checkout -b release/1.0.0
```

#### 步骤 2：推送 Release 分支

```bash
git push origin release/1.0.0
```

**此时 GitHub Actions 会自动触发：**
- `release.yml` 工作流：构建代码，等待手动批准部署到 staging 环境

#### 步骤 3：手动批准部署到 Staging

1. 在 GitHub Actions 页面找到正在运行的 workflow
2. 在 "Deploy to Staging (Manual Approval)" 步骤点击 "Review deployments"
3. 选择 `staging` 环境并批准部署

#### 步骤 4：测试验证

在 staging 环境进行充分测试，如果发现问题：

```bash
# 在 release 分支上修复问题
git add .
git commit -m "fix: 修复xxx问题"
git push origin release/1.0.0
```

每次推送都会触发新的 staging 部署流程。

#### 步骤 5：合并到 main 和 develop

测试通过后，将 release 分支合并：

```bash
# 合并到 main
git checkout main
git pull origin main
git merge release/1.0.0
git push origin main

# 合并回 develop
git checkout develop
git pull origin develop
git merge release/1.0.0
git push origin develop
```

**此时 GitHub Actions 会自动触发：**
- `production.yml` 工作流（main 分支）：等待手动批准部署到生产环境

#### 步骤 6：创建版本 Tag

```bash
git checkout main
git tag v1.0.0
git push origin v1.0.0
```

**此时 GitHub Actions 会自动触发：**
- `deploy-pages.yml` 工作流：自动部署到 GitHub Pages

#### 步骤 7：清理分支

```bash
git branch -d release/1.0.0
git push origin --delete release/1.0.0
```

#### 完整流程图

```
┌─────────────────────────────────────────────────────────────────┐
│                        预发布流程                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   develop ──────────────────────────────────────→ develop       │
│       │                                              ▲          │
│       │ checkout -b release/1.0.0                   │          │
│       ▼                                              │          │
│   release/1.0.0 ──┬───────────────────┬─────────────┘          │
│                   │                   │                         │
│              [构建代码]           [合并回 develop]              │
│                   │                                             │
│              [手动批准]                                         │
│                   │                                             │
│           [部署到 staging]                                      │
│                   │                                             │
│              [测试验证]                                         │
│                   │                                             │
│              [合并到 main] ────→ main ────→ [手动批准生产部署]  │
│                                    │                            │
│                                    │ tag v1.0.0                 │
│                                    ▼                            │
│                           [自动部署 GitHub Pages]               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 场景三：生产环境部署

当代码合并到 main 分支后，需要手动批准才能部署到生产环境：

#### 步骤 1：确认 main 分支更新

确保 release 分支或 hotfix 分支已正确合并到 main：

```bash
git checkout main
git pull origin main
```

#### 步骤 2：查看 GitHub Actions 状态

合并到 main 后，`production.yml` 工作流会自动触发。在 GitHub Actions 页面：

1. 找到 "Production - Deploy to Production" 工作流
2. 等待 "Build for Production" 任务完成

#### 步骤 3：手动批准生产部署

1. 在 "Deploy to Production (Manual Approval Required)" 步骤
2. 点击 "Review deployments"
3. 选择 `production` 环境
4. 确认部署信息后点击 "Approve and deploy"

#### 步骤 4：验证生产环境

部署完成后，访问生产环境地址验证功能是否正常。

#### 步骤 5：创建版本 Tag（推荐）

```bash
git checkout main
git tag v1.0.0
git push origin v1.0.0
```

这将触发 GitHub Pages 自动部署。

#### 完整流程图

```
┌─────────────────────────────────────────────────────────────────┐
│                      生产环境部署流程                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   release/* 或 hotfix/* ──────→ main (合并)                     │
│                                    │                            │
│                                    ▼                            │
│                            [构建生产代码]                        │
│                                    │                            │
│                            [等待手动批准]                        │
│                                    │                            │
│                            ┌───────┴───────┐                    │
│                            │               │                    │
│                         [批准]          [拒绝]                   │
│                            │               │                    │
│                            ▼               ▼                    │
│                    [部署到生产环境]    [取消部署]                 │
│                            │                                    │
│                            ▼                                    │
│                    [创建版本 Tag]                                │
│                            │                                    │
│                            ▼                                    │
│                 [自动部署 GitHub Pages]                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 场景四：生产环境出现严重错误（Hotfix）

当生产环境出现紧急问题需要立即修复时，使用 hotfix 流程：

#### 步骤 1：创建 Hotfix 分支

```bash
# 从 main 分支创建 hotfix 分支
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug-fix
```

#### 步骤 2：修复问题

快速修复问题并提交：

```bash
git add .
git commit -m "hotfix: 紧急修复xxx问题"
git push origin hotfix/critical-bug-fix
```

**此时 GitHub Actions 会自动触发：**
- `hotfix.yml` 工作流：
  1. 构建代码
  2. 自动部署到 staging 环境进行验证
  3. 等待手动批准部署到生产环境

#### 步骤 3：在 Staging 验证修复

Hotfix 会自动部署到 staging 环境，请在 staging 环境验证修复是否有效。

#### 步骤 4：手动批准生产部署

验证通过后：

1. 在 GitHub Actions 页面找到 hotfix 工作流
2. 在 "Deploy Hotfix to Production (Manual Approval)" 步骤
3. 点击 "Review deployments" 并批准部署

#### 步骤 5：合并 Hotfix 到 main 和 develop

部署成功后，将 hotfix 分支合并回 main 和 develop：

```bash
# 合并到 main
git checkout main
git pull origin main
git merge hotfix/critical-bug-fix
git push origin main

# 合并到 develop（确保修复也在开发分支中）
git checkout develop
git pull origin develop
git merge hotfix/critical-bug-fix
git push origin develop
```

#### 步骤 6：创建修复版本 Tag

```bash
git checkout main
git tag v1.0.1
git push origin v1.0.1
```

#### 步骤 7：清理分支

```bash
git branch -d hotfix/critical-bug-fix
git push origin --delete hotfix/critical-bug-fix
```

#### 完整流程图

```
┌─────────────────────────────────────────────────────────────────┐
│                      紧急修复 (Hotfix) 流程                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   main ───────────────────────────────────────────→ main        │
│     │                                                  ▲        │
│     │ checkout -b hotfix/xxx                          │        │
│     ▼                                                  │        │
│   hotfix/xxx ──┬─────────────────────────────────────┘        │
│                │                                                │
│           [构建代码]                                            │
│                │                                                │
│     [自动部署到 staging]                                        │
│                │                                                │
│         [验证修复效果]                                          │
│                │                                                │
│         [手动批准生产部署]                                      │
│                │                                                │
│     ┌──────────┴──────────┐                                    │
│     │                     │                                    │
│  [批准]                [拒绝]                                   │
│     │                     │                                    │
│     ▼                     ▼                                    │
│ [部署到生产]          [继续修复]                                │
│     │                                                          │
│     ▼                                                          │
│ [合并到 main 和 develop]                                       │
│     │                                                          │
│     ▼                                                          │
│ [创建修复版本 Tag: v1.0.1]                                     │
│     │                                                          │
│     ▼                                                          │
│ [自动部署 GitHub Pages]                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 工作流与分支对应关系总结

| 场景 | 分支类型 | 触发的 GitHub Actions | 部署环境 | 审批要求 |
|-----|---------|---------------------|---------|---------|
| 新功能开发 | feature/* | ci.yml | 无 | 无 |
| 功能合并 | → develop | ci.yml, develop.yml | 开发环境 | 无 |
| 预发布测试 | release/* | release.yml | staging | 需要审批 |
| 生产发布 | → main | production.yml | 生产环境 | 需要审批 |
| 版本标记 | tag v* | deploy-pages.yml | GitHub Pages | 无 |
| 紧急修复 | hotfix/* | hotfix.yml | staging → 生产 | 生产需审批 |
| Bug 修复 | bugfix/* | ci.yml | 无 | 无 |
| 手动部署 | 任意 | manual-deploy.yml | 可选 | 可选 |

---

## 附录：常用 Git 命令速查

### 分支操作

```bash
# 查看所有分支
git branch -a

# 创建并切换分支
git checkout -b <branch-name>

# 切换分支
git checkout <branch-name>

# 删除本地分支
git branch -d <branch-name>

# 删除远程分支
git push origin --delete <branch-name>
```

### Tag 操作

```bash
# 创建 tag
git tag <tag-name>

# 创建带注释的 tag
git tag -a <tag-name> -m "Release message"

# 推送 tag
git push origin <tag-name>

# 推送所有 tag
git push origin --tags

# 删除本地 tag
git tag -d <tag-name>

# 删除远程 tag
git push origin --delete <tag-name>
```

### 合并操作

```bash
# 合并分支
git merge <branch-name>

# 合并时不使用 fast-forward
git merge --no-ff <branch-name>
```

---

## 注意事项

1. **代码审查**：所有合并到 develop、release 和 main 的 PR 都应该经过 Code Review
2. **环境审批**：staging 和 production 环境的部署需要相关人员手动批准
3. **版本规范**：使用语义化版本号（如 v1.0.0），遵循 `v<主版本>.<次版本>.<修订版本>` 格式
4. **分支清理**：feature、release、hotfix 分支合并后应及时删除
5. **同步 develop**：hotfix 和 release 合并到 main 后，记得同步合并回 develop

如有问题，请联系项目维护者。
