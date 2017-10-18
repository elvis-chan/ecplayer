import * as _ from 'underscore';

const SCRIPT_TIMEOUT_MS = 15000;

class ScriptLoader {
  constructor() {
    this.scriptPath = ScriptLoader.getScriptPath('ecplayer.js');
    this.queue = {};
  }

  static getScriptPath(scriptName) {
    let scriptPath = '';

    const scripts = document.getElementsByTagName('script');

    _.each(scripts, ({ src }) => {
      if (src) {
        const idx = src.lastIndexOf(`/${scriptName}`);

        if (idx >= 0) {
          scriptPath = src.substr(0, idx + 1);
        }
      }
    });

    return scriptPath;
  }

  static isStyle(url) {
    const fileExtension = '.css';
    const file = url.replace(/\?(.*)/, '');

    return file.length >= fileExtension.length &&
      file.substr(file.length - fileExtension.length) === fileExtension;
  }

  load(url) {
    let promise = this.queue[url];

    if (promise) {
      return promise;
    }

    promise = new Promise((resolve, reject) => {
      const tag = this.createTag(url);

      tag.onerror = reject;
      tag.onload = resolve;

      const head = document.getElementsByTagName('head')[0] || document.documentElement;

      head.insertBefore(tag, head.firstChild);
    });

    this.queue[url] = promise;

    return promise;
  }

  createTag(scriptName) {
    return ScriptLoader.isStyle(scriptName) ?
      this.createStyleTag(scriptName) :
      this.createScriptTag(scriptName);
  }

  createScriptTag(scriptName) {
    const tag = document.createElement('script');

    tag.type = 'text/javascript';
    tag.charset = 'utf-8';
    tag.async = true;
    tag.timeout = SCRIPT_TIMEOUT_MS;
    tag.src = `${this.scriptPath}/${scriptName}`;

    return tag;
  }

  createStyleTag(scriptName) {
    const tag = document.createElement('link');

    tag.type = 'text/css';
    tag.rel = 'stylesheet';
    tag.href = `${this.scriptPath}/${scriptName}`;

    return tag;
  }
}

export default new ScriptLoader();
