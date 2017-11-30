import * as _ from 'underscore';

import { STATE_BUFFERING, QUALITIES } from 'app/events'; /* Added by [J] */
import DefaultProvider from './DefaultProvider';

class ShakaProvider extends DefaultProvider {
  instance = null;

  // eslint-disable-next-line class-methods-use-this
  getName() {
    return { name: 'shaka' };
  }

  setup(options) {
    super.setup(options);
    window.shaka.polyfill.installAll();

    this.instance = new window.shaka.Player(this.mediaEle);
    this.instance.load(options.file).then(this.handleLoadedManifest.bind(this));
  }

  getQualityLevels() {
    this.qualityLevels = this.instance.getVariantTracks();
    this.outputQualityLevels = _.map(this.qualityLevels, qualityLevel => ({
      bitrate: qualityLevel.bandwidth,
      width: qualityLevel.width,
      height: qualityLevel.height,
      label: `${qualityLevel.height}p`,
    }));
    // this.core.trigger(QUALITIES); /* Added by [J] */
    return this.outputQualityLevels;
  }

  getCurrentQuality() {
    this.getQualityLevels();

    const idx = _.findIndex(this.qualityLevels, qualityLevel => qualityLevel.active === true);

    return this.outputQualityLevels[idx];
  }

  setCurrentQuality(index) {
    if (index === -1) {
      this.instance.configure({ abr: { enabled: true } });
    } else {
      this.instance.configure({ abr: { enabled: false } });
      this.instance.selectVariantTrack(this.qualityLevels[index], true);
    }
  }

  handleLoadedManifest() {
    this.getQualityLevels();
    this.core.trigger(QUALITIES);
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
