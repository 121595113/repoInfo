/* eslint-disable no-console */
const fs = require('fs');
const { version, name } = require('./package.json');
// const AntdVersion = require('antd').version;

let repoInfo = {
  name,
  version,
  // AntdVersion,
  buildTime: Date.now()
};

try {
  let outBranch;
  let commitHash;

  if (fs.existsSync(`${process.cwd()}/.repoInfo.js`)) {
    try {
      [{ branch: outBranch, commitHash }] = [require('../.repoInfo')];
    // eslint-disable-next-line no-empty
    } catch (error) { }
  }

  const { abbreviatedSha, sha, branch, lastTag } = require('git-repo-info')();
  repoInfo = {
    ...repoInfo,
    sha: abbreviatedSha || sha || commitHash,
    branch: branch || outBranch,
    lastTag
  };
} catch (error) {
  console.error('repoInfo:', error);
}

process.env.REACT_APP_REPO_INFO = JSON.stringify(repoInfo);
