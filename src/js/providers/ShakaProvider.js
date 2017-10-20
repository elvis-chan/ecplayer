import DefaultProvider from './DefaultProvider';

class ShakaProvider extends DefaultProvider {
  instance = null;

  constructor(api) {
    super(api);

    this.state = 'IDLE';
  }

  // eslint-disable-next-line class-methods-use-this
  getName() {
    return { name: 'shaka' };
  }

  setup(options) {
    super.setup(options);

    if (options.autoplay) {
      this.mediaEle.autoplay = true;
    }

    if (options.mute) {
      this.mediaEle.muted = true;
    }

    window.shaka.polyfill.installAll();

    this.instance = new window.shaka.Player(this.mediaEle);
    this.instance.load(options.file);
  }

  getQualityLevels() {
    console.warn(this.instance.getVariantTracks());
    return this.instance.getVariantTracks();
  }
}

export default ShakaProvider;
