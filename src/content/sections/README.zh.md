# 配置结构示例

所有栏目内容、图片与可下载文件都集中在本目录，便于统一维护。

- `site/config.json`：站点导航、Hero、终端命令、入会表单等。
- `highlights/`、`activities/` 等：各栏目文本、顺序与按钮。
- `*/media/`：栏目对应的图片资源，直接替换或新增即可。
- `resources/library/`：上传 PDF/文档后会自动出现在资源卡片中。
- `blog/`：每篇文章一个文件夹，`index.md` 为正文，配图放在同级目录。

修改完成后运行 `npm run dev` 可实时预览效果。
