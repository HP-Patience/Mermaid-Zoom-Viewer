# GitHub Releases 发布指南

本指南将教你如何在 GitHub Releases 上编译并发布 Mermaid Zoom Viewer 插件的版本。

## 1. 准备工作

### 1.1 确保所有代码已提交

在发布前，确保所有更改都已提交到 Git 仓库：

```bash
# 检查当前状态
git status

# 添加所有更改
git add .

# 提交更改
git commit -m "准备发布新版本"

# 推送到远程仓库
git push
```

### 1.2 运行构建命令生成编译产物

```bash
# 运行构建命令
npm run build

# 检查是否生成了 main.js 文件
ls -la main.js
```

构建成功后，你会在项目根目录看到生成的 `main.js` 文件。

## 2. 创建 GitHub Release

### 2.1 登录 GitHub

1. 打开浏览器，访问 [GitHub](https://github.com)
2. 登录你的 GitHub 账号

### 2.2 导航到仓库

1. 访问 [Mermaid-Zoom-Viewer 仓库](https://github.com/HP-Patience/Mermaid-Zoom-Viewer)
2. 点击顶部导航栏中的 "Releases" 选项卡

### 2.3 创建新 Release

1. 点击 "Draft a new release" 按钮
2. 在 "Tag version" 输入框中输入版本号（例如：`v1.0.0`）
3. 在 "Target" 下拉菜单中选择要发布的分支（通常是 `master`）
4. 在 "Release title" 输入框中输入发布标题（例如："v1.0.0 Release"）
5. 在 "Description" 文本框中输入发布说明，包括：
   - 新版本的功能
   - 修复的问题
   - 任何重要的变更

### 2.4 上传构建产物

1. 滚动到 "Attach binaries by dropping them here or selecting them"
2. 点击该区域，选择生成的 `main.js` 文件
3. 等待文件上传完成

### 2.5 发布版本

1. 检查所有信息是否正确
2. 点击 "Publish release" 按钮

## 3. 版本管理

### 3.1 更新版本号

当你需要发布新版本时，首先更新 `package.json` 文件中的版本号：

```json
{
  "name": "mermaid-zoom-viewer",
  "version": "1.0.1",  // 更新这里的版本号
  // ...
}
```

### 3.2 运行版本更新脚本

```bash
# 运行版本更新脚本
npm run version

# 提交版本更新
git commit -m "Bump version to 1.0.1"

# 推送到远程仓库
git push
```

这个脚本会：
1. 读取 `package.json` 中的版本号
2. 更新 `manifest.json` 中的版本号
3. 更新 `versions.json` 文件，添加新的版本记录

## 4. 最佳实践

### 4.1 发布前检查清单

- [ ] 所有代码已提交
- [ ] 构建成功，生成了 `main.js` 文件
- [ ] 版本号已更新
- [ ] `manifest.json` 和 `versions.json` 已更新
- [ ] 编写了详细的发布说明
- [ ] 测试了插件的基本功能

### 4.2 编写发布说明

发布说明应该包括：

1. **新版本的功能**：列出新增的功能
2. **修复的问题**：列出修复的 bug
3. **变更的内容**：列出任何重要的变更
4. **兼容性信息**：说明与 Obsidian 版本的兼容性
5. **使用方法**：如果有新功能，简要说明使用方法

### 4.3 处理版本兼容性

- **语义化版本**：使用语义化版本号（例如：`1.0.0`）
- **向后兼容**：尽量保持向后兼容，避免破坏现有功能
- **版本记录**：在 `versions.json` 文件中记录每个版本的最低 Obsidian 版本要求

## 5. 故障排除

### 5.1 构建失败

如果构建失败，检查以下内容：

- TypeScript 编译错误
- 依赖项是否已安装
- 配置文件是否正确

### 5.2 Release 发布失败

如果 Release 发布失败，检查以下内容：

- 文件大小是否超过 GitHub 的限制（通常是 2GB）
- 网络连接是否稳定
- GitHub 账号是否有足够的权限

### 5.3 插件安装失败

如果用户安装插件失败，检查以下内容：

- `main.js` 文件是否正确上传
- 版本号是否与 `manifest.json` 中的一致
- `manifest.json` 中的 `minAppVersion` 是否设置正确

## 6. 示例发布流程

### 发布 v1.0.0 版本

1. **更新版本号**：在 `package.json` 中设置 `version: "1.0.0"`
2. **运行版本脚本**：`npm run version`
3. **提交更改**：`git commit -m "Bump version to 1.0.0"`
4. **推送到远程**：`git push`
5. **构建插件**：`npm run build`
6. **创建 Release**：在 GitHub 上创建新 Release，上传 `main.js`
7. **发布版本**：点击 "Publish release"

## 7. 总结

通过以上步骤，你可以成功在 GitHub Releases 上编译并发布 Mermaid Zoom Viewer 插件的版本。这将使你的插件更加专业，并方便用户下载和安装。

记住，定期更新插件并发布新版本是保持插件活跃度和用户满意度的重要方式。

---

希望本指南对你有所帮助！如果你有任何问题，请在 GitHub 仓库上创建一个 issue。