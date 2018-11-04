# uooconline learner
仅支持 http://www.uooconline.com/

## 使用
需要 Nodejs

### 刷课
1. 下载项目源码
2. 进入项目文件夹，`npm i`
3. 编辑`index.js`，设置 Cookie 和 课程ID
	- Cookie 可登陆后在 F12开发人员工具 查看 Network 选项卡并刷新页面得到
	![](https://i.loli.net/2018/11/03/5bdd197e657e9.png)
	-  课程ID 可在课程详情页由URL得到
	![](https://i.loli.net/2018/11/03/5bdd197e6b77a.png)
4. `npm start`

### 下载字幕
以方便在章节测验时搜索相关知识点

```
npm run subtitle
```

1. 字幕会按章节分开下载到`subtitles`文件夹内
2. 会忽略已经下载过的章节（已有文件）
3. 如果是那种闯关学习模式的，无法下载没学到的章节
