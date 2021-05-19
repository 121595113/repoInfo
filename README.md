# RepoInfo

合理的用控制台展示有用的信息。

## 是什么？

[](./1621435853468.jpg)
[](./1621435942109.jpg)
[](./1621436103341.jpg)

### 场景一

有一天突然有人跑过来问你：“你知道线上运行的是哪个分支的代码？线上出现问题，我应该基于哪个分支做修改？”

### 场景二

开发测试阶段经常出现因为缓存问题引起的bug，如何判断当前的运行的代码是最新的代码？别人告诉你部署成功了，怎么验证运行的是部署成功的代码？

### 场景三

你是如何知道线上代码是团队小伙伴通宵到几点才部署到线上的？想不想知道你上次是发版到几点下班的？

### 解决办法？

场景一，只能通过构建/部署平台历史纪录或者查看之前的发版邮件。项目时间短应该能找到相关纪录信息。

场景二，可以通过时间戳/HASH方式绝对保证修改的文件永远请求最新的。至于别人是否真的部署成功了，这个点真不知道，但我可以通过验证新的功能特性有没有正确的工作来判断代码是不是最新的呀（龇牙笑的脸）。

场景三，登陆到构建/部署平台看纪录不就行了吗？你确保团队大部分人是有权限看到这些的？

针对以上场景我们提供了一种思路，把你想知道的直接输出到某个地方（比如浏览器控制台）。问题是如何动态采集到这些信息呢？这个库[git-repo-info](https://www.npmjs.com/package/git-repo-info)或许能帮到我们。

```javascript
var getRepoInfo = require('git-repo-info');

var info = getRepoInfo();

info.branch               // current branch
info.sha                  // current sha
info.abbreviatedSha       // first 10 chars of the current sha
info.tag                  // tag for the current sha (or `null` if no tag exists)
info.lastTag              // tag for the closest tagged ancestor
                          //   (or `null` if no ancestor is tagged)
info.commitsSinceLastTag  // number of commits since the closest tagged ancestor
                          //   (`0` if this commit is tagged, or `Infinity` if no ancestor is tagged)
info.committer            // committer for the current sha
info.committerDate        // commit date for the current sha
info.author               // author for the current sha
info.authorDate           // authored date for the current sha
info.commitMessage        // commit message for the current sha
info.root                 // root directory for the Git repo or submodule
                          //   (if in a worktree, this is the directory containing the original copy)
info.commonGitDir         // directory containing Git metadata for this repo or submodule
                          //   (if in a worktree, this is the primary Git directory for the repo)
info.worktreeGitDir       // if in a worktree, the directory containing Git metadata specific to
                          //   this worktree; otherwise, this is the same as `commonGitDir`.
```

**有了这些值，怎么写到控制台呢？**

可以在编译的阶段，通过node注入到业务代码里。但是，问题是CI/CD构建拉取的git是HEAD指向的指针，没有branch信息。庆幸的是CI/CD有环境变量，变量里有branch信息，可以通过CI/CD命令行把环境变量写到工作空间下，方式如下：

```bash
echo "module.exports = {branch: '${BRANCH_NAME}', commitHash: '${GIT_COMMIT:0:8}'}" > .repoInfo.js
```

然后编译的时候读取`.repoInfo.js`文件值再注入到业务代码里。

编译阶段示例代码见工程中的`repoInfo-build.js`。

### 项目中如何使用？

项目中的封装见`repoInfo-client.js`，把这个文件拷到自己的项目中，然后在入口件引入即可，如示例项目`example/src/index.js`。

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import injectRepoInfo from './repoInfo-client';

injectRepoInfo();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals(console.log);

```

## 备注

示例项目是基于create-react-app生成的，运行命令[点这里](./example/README.md)
