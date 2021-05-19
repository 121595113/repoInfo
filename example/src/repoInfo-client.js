/* eslint-disable no-eval */
/* eslint-disable func-names */
/* eslint-disable */
export default function injectRepoInfo() {
  if (!localStorage.getItem('showLogs')) return;

  const $console = {};
  for (const key of ['log', 'group', 'groupCollapsed', 'groupEnd']) {
    $console[key] = function () {
      eval(`console["${key}"].apply(null, arguments)`);
    };
  }

  try {
    const repoInfo = JSON.parse(process.env.REACT_APP_REPO_INFO) || {};

    const { name, sha, branch, lastTag, version, AntdVersion, buildTime } = repoInfo;

    /**
    * ====自定义log配置在这里log[]====
    * log: {
    * key: string, // 需要展示的字段
    * value: string, // 展示内容值
    * padding?: number, // key展示宽度
    * fontCssStr?: CSS, // 值字体样式，默认color:#0072c6
    * }
    */
    const arr = [
      {
        key: 'Version',
        value: version
      },
      {
        key: 'LastTag',
        value: lastTag
      },
      {
        key: 'Branch',
        value: branch
      },
      {
        key: 'Sha',
        value: sha
      },
      {
        key: 'Build  at',
        value: new Date(buildTime).toLocaleString()
      },
      {
        key: 'Antd',
        value: AntdVersion
      }
    ].filter(item => item.value);

    const padding = Math.max.apply(null, arr.map(item => item.key.length));
    const fontCssStr = 'color: #0072c6';
    const defaultOptions = { padding, fontCssStr };

    const log = (key, value, options) => {
      const { padding, fontCssStr } = { ...defaultOptions, ...options };
      $console.log(`${key.padEnd(padding, ' ')}:%c ${value}`, fontCssStr);
    };

    $console.groupCollapsed(name);
    arr.forEach(({ key, value, ...others }) => log(key, value, others));
    $console.groupEnd();
  // eslint-disable-next-line no-empty
  } catch (error) { }

  // window.$console = $console in window ? window.$console : $console;
}
