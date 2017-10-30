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
  }
}

export default HTML5Provider;
