# Elio · 宝宝的双语小世界

面向 2–3 岁宝宝的中英双语启蒙网站。打开即用，无需登录、无广告、无第三方依赖。

- 课程大纲：[CURRICULUM.md](CURRICULUM.md)
- 6 大主题、49 节小课：认识世界 · 英语启蒙 · 数字形状 · 中国故事 · 世界之旅 · 小小思考家

## 本地运行

```bash
python3 -m http.server 8765
```

然后打开 http://localhost:8765

## 部署到 GitHub Pages

仓库 Settings → Pages → Source 选 `Deploy from a branch`，分支选 `main`、目录 `/ (root)`。
发布后访问 `https://npc7.github.io/elio/`。

## 目录

```
index.html          入口
css/style.css       样式
js/data.js          课程内容（加课只需改这里）
js/app.js           交互引擎：cards / choose / count / story / sort
sw.js               离线缓存（仅 HTTPS 下启用；改动静态文件后请把 CACHE 版本号 +1）
```

## 添加一节课

在 `js/data.js` 对应主题的 `lessons` 里加一项，例如：

```js
{ id: 'ocean', e: '🐳', zh: '海洋动物', en: 'Ocean Animals', type: 'cards', items: [
  C('🐳', '鲸鱼', 'whale'), C('🐙', '章鱼', 'octopus'),
] },
```
