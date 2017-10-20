import { STATE_BUFFERING } from 'app/events';
import DefaultProvider from './DefaultProvider';

class ShakaProvider extends DefaultProvider {
  instance = null;

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
    this.instance.load(options.file).then(this.handleLoadedManifest.bind(this));
  }

  handleLoadedManifest() {
    this.qualityLevels = this.instance.getVariantTracks();
    this.audioTracks = this.instance.getAudioLanguages();

    this.instance.addEventListener('buffering', this.handleBuffering.bind(this));
  }

  handleBuffering({ buffering }) {
    if (buffering) {
      this.setState(STATE_BUFFERING);
    }
  }
}

export default ShakaProvider;
