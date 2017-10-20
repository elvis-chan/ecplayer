import DefaultProvider from './DefaultProvider';

/* eslint-disable class-methods-use-this */

class HTML5Provider extends DefaultProvider {
  constructor(api) {
    super(api);

    this.state = 'IDLE';
  }

  getName() {
    return { name: 'html5' };
  }

  setup(options) {
    super.setup(options);

    this.mediaEle.src = options.file;

    if (options.autoplay) {
      this.mediaEle.autoplay = true;
    }

    if (options.mute) {
      this.mediaEle.muted = true;
    }
  }
}

export default HTML5Provider;
