# MITCE 帮助中心静态页

这是一个可直接上传到 GitHub Pages 的静态帮助中心页面，包含首页、平台页、本地教程页、快捷说明页和正式发布所需的基础说明页。

## 本地预览

```bash
npm run serve
```

打开：

```text
http://localhost:8080
```

## 页面结构

- `index.html`：帮助中心首页
- `pages/windows.html`：Windows 软件列表
- `pages/macos.html`：macOS 软件列表
- `pages/android.html`：Android 软件列表
- `pages/ios-ipados.html`：iOS&iPadOS 软件列表
- `pages/quick-reference.html`：快捷说明与常见词汇
- `pages/privacy.html`：隐私政策
- `pages/terms.html`：使用条款
- `pages/support.html`：联系支持与上线前检查
- `guides/`：各软件本地教程页
- `404.html`：GitHub Pages 错误页
- `sitemap.xml`：搜索引擎索引入口，发布后可按实际域名调整
- `.nojekyll`：避免 GitHub Pages 使用 Jekyll 处理静态文件
- `styles.css`：黑白主题与手机端适配
- `script.js`：移动设备识别、导航菜单和目录高亮

## GitHub Pages 上传

1. 新建 GitHub 仓库。
2. 上传本目录所有文件。
3. 在仓库 `Settings -> Pages` 中选择发布分支。
4. 等待 GitHub Pages 构建完成后访问站点地址。

## 验证

```bash
npm test
```

测试会检查页面结构、内部链接、移动端脚本、黑白主题、404 页面和发布说明。
